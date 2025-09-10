# Odoo HR Management System

## Prerequisites
- Docker
- Docker Compose

## Setup Instructions

### 1. Initial Database Setup
Initialize the Odoo database with the base module:
```bash
docker-compose run odoo odoo -d odoo -i base --stop-after-init
```

### 2. Start the Application
```bash
docker-compose up
```

### 3. Stop the Application
```bash
docker-compose down
```

### 4. Reset Database (if needed)
To completely reset the database and start fresh:
```bash
docker-compose down -v
docker-compose run odoo odoo -d odoo -i base --stop-after-init
docker-compose up
```

## Access
- **Web Interface**: http://localhost:8069
- **Database**: PostgreSQL on port 5432 (internal)
- **API Endpoints**: 
  - Login: `POST /api/auth/login`
  - Employees: `GET/POST /api/hr/employees`

## Default Credentials
After database initialization, create an admin user through the web interface.

## Custom Addons
Custom addons are located in `./odoo/addons/` and automatically loaded.

## Troubleshooting
- If you see "Database not initialized" errors, run the initial database setup command
- Missing attachment file errors are non-critical and don't affect functionality
- Clear browser cache if the UI