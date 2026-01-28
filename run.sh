#!/bin/bash
set -e

# Activate virtual environment
echo "Activating virtual environment..."
python3 -m venv env
source env/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Move to backend directory
echo "Changing directory to backend..."
cd backend

# Start the FastAPI server in the background
echo "Starting FastAPI server on http://127.0.0.1:8000 ..."
uvicorn app.main:app &

# Open the default browser
echo "Opening the browser..."
xdg-open http://127.0.0.1:8000
