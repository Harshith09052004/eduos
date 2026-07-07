#!/bin/bash
set -e

echo "=== Updating system ==="
sudo apt update && sudo apt upgrade -y

echo "=== Installing Docker ==="
sudo apt install -y docker.io
sudo apt install -y docker-compose-v2 2>/dev/null || \
sudo apt install -y docker-compose-plugin 2>/dev/null || \
sudo apt install -y docker-compose

sudo usermod -aG docker $USER
sudo systemctl enable docker

echo "=== Done! ==="
echo "Log out and back in, then copy your project and run: ./deploy.sh"
