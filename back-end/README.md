# Odoo HR Management System

## Prerequisites
- Docker
- Docker Compose

## Setup Instructions

### 1. Build custom images
```bash
docker build -t my-custom-odoo-image .
```

### 2. Initial Database Setup
Initialize the Odoo database with the base module:
```bash
docker-compose run odoo odoo -d odoo -i base --stop-after-init
```

### 3. Start the Application
```bash
docker-compose up
```

## Access
- **Web Interface**: http://localhost:8080/web#action
