#!/bin/bash

# Deploy script for NCKH Project
# This script helps deploy the application using Docker Compose

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed"
}

# Check if .env file exists
check_env_file() {
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from docker-compose.env.example..."
        if [ -f docker-compose.env.example ]; then
            cp docker-compose.env.example .env
            print_warning "Please edit .env file with your configuration before continuing."
            print_warning "Press Enter to continue after editing, or Ctrl+C to cancel..."
            read
        else
            print_error "docker-compose.env.example not found. Please create .env file manually."
            exit 1
        fi
    else
        print_success ".env file exists"
    fi
}

# Check required environment variables
check_required_vars() {
    print_info "Checking required environment variables..."
    
    source .env
    
    local missing_vars=()
    
    if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" = "your-super-secret-jwt-key-change-in-production" ]; then
        missing_vars+=("JWT_SECRET")
    fi
    
    if [ -z "$CLOUDINARY_CLOUD_NAME" ] || [ "$CLOUDINARY_CLOUD_NAME" = "your_cloud_name" ]; then
        missing_vars+=("CLOUDINARY_CLOUD_NAME")
    fi
    
    if [ -z "$CLOUDINARY_API_KEY" ] || [ "$CLOUDINARY_API_KEY" = "your_api_key" ]; then
        missing_vars+=("CLOUDINARY_API_KEY")
    fi
    
    if [ -z "$CLOUDINARY_API_SECRET" ] || [ "$CLOUDINARY_API_SECRET" = "your_api_secret" ]; then
        missing_vars+=("CLOUDINARY_API_SECRET")
    fi
    
    if [ -z "$NEO4J_URI" ] || [ "$NEO4J_URI" = "neo4j+s://your-neo4j-instance.databases.neo4j.io" ]; then
        missing_vars+=("NEO4J_URI")
    fi
    
    if [ -z "$NEO4J_PASSWORD" ] || [ "$NEO4J_PASSWORD" = "your_neo4j_password" ]; then
        missing_vars+=("NEO4J_PASSWORD")
    fi
    
    if [ -z "$GEMINI_API_KEY" ] || [ "$GEMINI_API_KEY" = "your_gemini_api_key" ]; then
        missing_vars+=("GEMINI_API_KEY")
    fi
    
    if [ ${#missing_vars[@]} -gt 0 ]; then
        print_error "Missing or default values for required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        print_warning "Please update .env file with correct values."
        exit 1
    fi
    
    print_success "All required environment variables are set"
}

# Download model from Google Drive
download_model() {
    local drive_file_id="$1"
    local output_path="ml-server/leaf_multitask_best.pth"
    
    if [ -z "$drive_file_id" ]; then
        print_error "Google Drive File ID is required"
        return 1
    fi
    
    print_info "Downloading model from Google Drive..."
    print_info "File ID: $drive_file_id"
    
    # Check if gdown is installed
    if ! command -v gdown &> /dev/null; then
        print_info "Installing gdown..."
        pip install gdown || {
            print_error "Failed to install gdown. Please install manually: pip install gdown"
            return 1
        }
    fi
    
    # Download model
    if gdown "https://drive.google.com/uc?id=${drive_file_id}" -O "$output_path"; then
        print_success "Model downloaded successfully!"
        print_info "File location: $output_path"
        print_info "File size: $(du -h "$output_path" | cut -f1)"
        return 0
    else
        print_error "Failed to download model"
        return 1
    fi
}

# Check if model file exists
check_model_file() {
    if [ ! -f ml-server/leaf_multitask_best.pth ]; then
        print_warning "Model file (ml-server/leaf_multitask_best.pth) not found."
        
        # Check if DRIVE_FILE_ID is set in .env
        if [ -f .env ]; then
            source .env
            if [ -n "$DRIVE_FILE_ID" ]; then
                print_info "DRIVE_FILE_ID found in .env, attempting to download..."
                if download_model "$DRIVE_FILE_ID"; then
                    return 0
                fi
            fi
        fi
        
        print_warning "Options:"
        echo "  1. Download from Google Drive (provide File ID)"
        echo "  2. Continue without model (ML Server will fail)"
        echo "  3. Cancel and exit"
        read -p "Choose option [1-3]: " choice
        
        case $choice in
            1)
                read -p "Enter Google Drive File ID: " file_id
                if download_model "$file_id"; then
                    print_success "Model downloaded, continuing deployment..."
                else
                    print_error "Failed to download model"
                    exit 1
                fi
                ;;
            2)
                print_warning "Continuing without model file..."
                ;;
            3)
                print_info "Exiting..."
                exit 0
                ;;
            *)
                print_error "Invalid option"
                exit 1
                ;;
        esac
    else
        print_success "Model file found"
    fi
}

# Build Docker images
build_images() {
    print_info "Building Docker images..."
    
    if docker compose build; then
        print_success "Docker images built successfully"
    else
        print_error "Failed to build Docker images"
        exit 1
    fi
}

# Start services
start_services() {
    print_info "Starting services..."
    
    if docker compose up -d; then
        print_success "Services started successfully"
    else
        print_error "Failed to start services"
        exit 1
    fi
}

# Stop services
stop_services() {
    print_info "Stopping services..."
    
    if docker compose down; then
        print_success "Services stopped successfully"
    else
        print_error "Failed to stop services"
        exit 1
    fi
}

# Restart services
restart_services() {
    print_info "Restarting services..."
    
    if docker compose restart; then
        print_success "Services restarted successfully"
    else
        print_error "Failed to restart services"
        exit 1
    fi
}

# Show logs
show_logs() {
    print_info "Showing logs (Press Ctrl+C to exit)..."
    docker compose logs -f
}

# Show status
show_status() {
    print_info "Service status:"
    docker compose ps
    
    echo ""
    print_info "Health checks:"
    
    # Check backend
    if curl -s http://localhost:5000/health > /dev/null 2>&1; then
        print_success "Backend is healthy (http://localhost:5000/health)"
    else
        print_warning "Backend health check failed"
    fi
    
    # Check ML server
    if curl -s http://localhost:5001/health > /dev/null 2>&1; then
        print_success "ML Server is healthy (http://localhost:5001/health)"
    else
        print_warning "ML Server health check failed"
    fi
    
    # Check frontend
    if curl -s http://localhost:80/health > /dev/null 2>&1; then
        print_success "Frontend is healthy (http://localhost:80)"
    else
        print_warning "Frontend health check failed"
    fi
}

# Clean up (remove containers, volumes, images)
clean_up() {
    print_warning "This will remove all containers, volumes, and images. Are you sure? (yes/no)"
    read -r response
    if [ "$response" = "yes" ]; then
        print_info "Cleaning up..."
        docker compose down -v --rmi all
        print_success "Cleanup completed"
    else
        print_info "Cleanup cancelled"
    fi
}

# Main menu
show_menu() {
    echo ""
    echo "=========================================="
    echo "  NCKH Project Deployment Script"
    echo "=========================================="
    echo ""
    echo "1. Deploy (Build + Start)"
    echo "2. Start services"
    echo "3. Stop services"
    echo "4. Restart services"
    echo "5. Show logs"
    echo "6. Show status"
    echo "7. Clean up (remove all)"
    echo "8. Exit"
    echo ""
    read -p "Choose an option [1-8]: " choice
}

# Main execution
main() {
    clear
    print_info "NCKH Project Deployment Script"
    echo ""
    
    # Initial checks
    check_docker
    check_env_file
    check_required_vars
    check_model_file
    
    # If no arguments, show menu
    if [ $# -eq 0 ]; then
        while true; do
            show_menu
            case $choice in
                1)
                    build_images
                    start_services
                    sleep 5
                    show_status
                    ;;
                2)
                    start_services
                    show_status
                    ;;
                3)
                    stop_services
                    ;;
                4)
                    restart_services
                    show_status
                    ;;
                5)
                    show_logs
                    ;;
                6)
                    show_status
                    ;;
                7)
                    clean_up
                    ;;
                8)
                    print_info "Exiting..."
                    exit 0
                    ;;
                *)
                    print_error "Invalid option"
                    ;;
            esac
        done
    else
        # Handle command line arguments
        case $1 in
            deploy|build)
                build_images
                start_services
                sleep 5
                show_status
                ;;
            start)
                start_services
                show_status
                ;;
            stop)
                stop_services
                ;;
            restart)
                restart_services
                show_status
                ;;
            logs)
                show_logs
                ;;
            status)
                show_status
                ;;
            clean)
                clean_up
                ;;
            *)
                echo "Usage: $0 [deploy|start|stop|restart|logs|status|clean]"
                exit 1
                ;;
        esac
    fi
}

# Run main function
main "$@"

