#!/usr/bin/env python3
"""
Script to download model from Google Drive
Supports multiple methods: gdown, direct link, or manual download
"""

import os
import sys
import subprocess
import requests
from pathlib import Path

def print_info(msg):
    print(f"ℹ️  {msg}")

def print_success(msg):
    print(f"✅ {msg}")

def print_warning(msg):
    print(f"⚠️  {msg}")

def print_error(msg):
    print(f"❌ {msg}")

def check_gdown():
    """Check if gdown is installed, install if not"""
    try:
        import gdown
        return True
    except ImportError:
        print_info("Installing gdown...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "gdown"])
            return True
        except subprocess.CalledProcessError:
            print_error("Failed to install gdown")
            return False

def download_with_gdown(file_id, output_path):
    """Download using gdown library"""
    try:
        import gdown
        url = f"https://drive.google.com/uc?id={file_id}"
        print_info(f"Downloading from Google Drive...")
        print_info(f"File ID: {file_id}")
        print_info(f"Output: {output_path}")
        
        gdown.download(url, output_path, quiet=False)
        
        if os.path.exists(output_path):
            size = os.path.getsize(output_path) / (1024 * 1024)  # MB
            print_success(f"Model downloaded successfully! ({size:.2f} MB)")
            return True
    except Exception as e:
        print_error(f"Failed to download: {e}")
        return False

def download_with_requests(url, output_path):
    """Download using requests library"""
    try:
        print_info(f"Downloading from URL...")
        response = requests.get(url, stream=True, timeout=30)
        response.raise_for_status()
        
        total_size = int(response.headers.get('content-length', 0))
        downloaded = 0
        
        with open(output_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
                    downloaded += len(chunk)
                    if total_size > 0:
                        percent = (downloaded / total_size) * 100
                        print(f"\rProgress: {percent:.1f}%", end='', flush=True)
        
        print()  # New line after progress
        if os.path.exists(output_path):
            size = os.path.getsize(output_path) / (1024 * 1024)  # MB
            print_success(f"Model downloaded successfully! ({size:.2f} MB)")
            return True
    except Exception as e:
        print_error(f"Failed to download: {e}")
        return False

def main():
    script_dir = Path(__file__).parent
    ml_server_dir = script_dir / "ml-server"
    output_path = ml_server_dir / "leaf_multitask_best.pth"
    
    # Check if model already exists
    if output_path.exists():
        print_warning(f"Model file already exists: {output_path}")
        response = input("Do you want to overwrite it? (yes/no): ")
        if response.lower() != "yes":
            print_info("Skipping download.")
            return 0
    
    # Get input from user
    print("=" * 60)
    print("Model Downloader")
    print("=" * 60)
    print()
    print("Please provide one of the following:")
    print("  1. Google Drive File ID (e.g., 1ABC123xyz...)")
    print("  2. Direct download URL")
    print()
    
    user_input = input("Enter Google Drive File ID or URL: ").strip()
    
    if not user_input:
        print_error("No input provided")
        return 1
    
    # Try to determine if it's a file ID or URL
    if user_input.startswith("http://") or user_input.startswith("https://"):
        # It's a URL
        if "drive.google.com" in user_input:
            # Extract file ID from Google Drive URL
            if "/file/d/" in user_input:
                file_id = user_input.split("/file/d/")[1].split("/")[0]
                print_info(f"Extracted File ID: {file_id}")
                if check_gdown():
                    if download_with_gdown(file_id, str(output_path)):
                        return 0
            elif "id=" in user_input:
                file_id = user_input.split("id=")[1].split("&")[0]
                print_info(f"Extracted File ID: {file_id}")
                if check_gdown():
                    if download_with_gdown(file_id, str(output_path)):
                        return 0
        else:
            # Direct download URL
            if download_with_requests(user_input, str(output_path)):
                return 0
    else:
        # Assume it's a file ID
        if check_gdown():
            if download_with_gdown(user_input, str(output_path)):
                return 0
    
    print_error("Failed to download model. Please check:")
    print("  1. File ID or URL is correct")
    print("  2. File is publicly accessible or you have access")
    print("  3. Internet connection is working")
    return 1

if __name__ == "__main__":
    sys.exit(main())

