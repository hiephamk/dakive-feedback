## Indoor Air Quality Feedback System
### Overview
#### This project is designed to assist public building managers in collecting and managing user feedback regarding the conditions of rooms within their buildings. By gathering real-time input from users, the system helps facility managers identify issues, optimize energy usage, and improve indoor air quality to create healthier and more comfortable environments.
### Key Features
- User-friendly interface for submitting feedback on room conditions
- Centralized dashboard for building managers to monitor reports from users
- Data-driven insights to support energy-saving initiatives
- Tools to track and enhance air quality in public buildings
### Technical Stack
- Backend: Django — Provides a robust API and handles data management
- Frontend: React.js, Vite — Delivers an interactive user interface and smooth user experience
- Database: PostgreSQL
### Getting Started
#### Prerequisites
    - Python 3.x
    - Node.js and npm
    - PostgreSQL or preferred database (optional)
    - Vite (https://vite.dev/guide/)
    - Chakra UI
### Installation
1. Clone the repository:
    - git clone https://github.com/yourusername/yourproject.git
    - cd yourproject
2. Backend setup:
    - Create and activate a virtual environment
    - Install dependencies:
    - pip install -r requirements.txt
    - Configure the database settings in settings.py
    - Create a .env file in the root directory of your project and add the following environment variables:
        EMAIL_HOST=your_email_host
        EMAIL_HOST_USER=your_host_user
        EMAIL_HOST_PASSWORD=your_host_password
        EMAIL_PORT=your_email_port
        DOMAIN=localhost:5173 - or your own domain

        ENGINE_DB=django.db.backends.postgresql
        NAME_DB=your_db_name
        USER_DB=your_db_user_name
        PASSWORD_DB=your_db_password
        HOST_DB=your_host_db
        PORT_DB=5432
#### Important:
    - Replace the placeholder values with your actual database credentials
    - Never commit the .env file to version control for security reasons
    - Add .env to your .gitignore file
#### Run migrations:
    - python manage.py makemigrations
    - python manage.py migrate
    - python manage.py runserver
3. Frontend setup:
    - Navigate to the frontend directory (if separate)
    - npm create vite@latest (https://vite.dev/guide/)
    - Install dependencies
    - npm install
    - npm run dev
### Running the Application:
    - Users can submit feedback about room temperature, lighting, air quality, and other conditions through the frontend interface.
    - Building managers can:
        + Login or Register
        + Create and manage their own organizations, buildings, and rooms
        + Generate QR codes for feedback submission forms
        + Synchoronize data from IoT devices
        + review submitted reports to identify problem areas and take corrective action.
        + View building and room ratings based on user feedback and IoT data
### Project Structure:
    Project root
    ├── backend
    │   ├── account
    │   ├── Building
    │   ├── community
    │   ├── dist
    │   ├── feedback
    │   ├── main
    │   ├── media
    │   ├── my-venv
    │   ├── organization
    │   ├── static
    │   ├── staticfiles
    │   └── users
    └── frontend
        ├── node_modules
        ├── public
        └── src
### Authors:
    2025 Hiep Huynh
### License
    - This project is licensed under the MIT License.
### Copyright:
    Copyright 2025 HAMK Häme University of Applied Sciences
