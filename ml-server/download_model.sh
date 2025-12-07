#!/bin/bash

# Script to download model from Google Drive
# Usage: ./download_model.sh [DRIVE_FILE_ID] [OUTPUT_PATH]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Default values
DRIVE_FILE_ID="${1:-}"
OUTPUT_PATH="${2:-leaf_multitask_best.pth}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_FULL_PATH="${SCRIPT_DIR}/${OUTPUT_PATH}"

# Check if model already exists
if [ -f "$OUTPUT_FULL_PATH" ]; then
    print_warning "Model file already exists: $OUTPUT_FULL_PATH"
    read -p "Do you want to overwrite it? (yes/no): " overwrite
    if [ "$overwrite" != "yes" ]; then
        print_info "Skipping download."
        exit 0
    fi
fi

# Check if gdown is installed
if ! command -v gdown &> /dev/null; then
    print_info "Installing gdown..."
    pip install gdown
fi

# Method 1: Using gdown (recommended)
if [ -n "$DRIVE_FILE_ID" ]; then
    print_info "Downloading model from Google Drive..."
    print_info "File ID: $DRIVE_FILE_ID"
    print_info "Output: $OUTPUT_FULL_PATH"
    
    # Try to download using gdown
    if gdown "https://drive.google.com/uc?id=${DRIVE_FILE_ID}" -O "$OUTPUT_FULL_PATH"; then
        print_success "Model downloaded successfully!"
        print_info "File size: $(du -h "$OUTPUT_FULL_PATH" | cut -f1)"
        exit 0
    else
        print_error "Failed to download using gdown"
    fi
fi

# Method 2: Using wget/curl with direct link
print_info "Alternative: Using direct download link"
print_warning "Please provide one of the following:"
echo "  1. Google Drive File ID (for gdown)"
echo "  2. Direct download URL"
echo ""
read -p "Enter Google Drive File ID or direct URL: " input

if [[ "$input" =~ ^[a-zA-Z0-9_-]+$ ]]; then
    # Looks like a file ID
    print_info "Downloading using gdown with file ID: $input"
    if gdown "https://drive.google.com/uc?id=${input}" -O "$OUTPUT_FULL_PATH"; then
        print_success "Model downloaded successfully!"
        print_info "File size: $(du -h "$OUTPUT_FULL_PATH" | cut -f1)"
        exit 0
    fi
elif [[ "$input" =~ ^https?:// ]]; then
    # Looks like a URL
    print_info "Downloading from URL: $input"
    if command -v wget &> /dev/null; then
        wget -O "$OUTPUT_FULL_PATH" "$input"
    elif command -v curl &> /dev/null; then
        curl -L -o "$OUTPUT_FULL_PATH" "$input"
    else
        print_error "Neither wget nor curl is installed"
        exit 1
    fi
    
    if [ -f "$OUTPUT_FULL_PATH" ]; then
        print_success "Model downloaded successfully!"
        print_info "File size: $(du -h "$OUTPUT_FULL_PATH" | cut -f1)"
        exit 0
    fi
else
    print_error "Invalid input"
    exit 1
fi

print_error "Failed to download model"
exit 1

