# Full-Stack Trip Management Application
This project consists of a frontend and backend, where the backend is built with Flask (Python) and the frontend is built with React. The backend handles all the API logic, database management, and routing, while the frontend interacts with the backend to display and modify trip details.

## Backend Setup
The backend of the application is built using Flask, a lightweight Python web framework.

### Setting up the Flask Database

1. Configure your environment
```
FLASK_APP=app.py
FLASK_ENV=development
DATABASE_URI=sqlite:///app.db  # Or your database configuration
```

Initialize the Database: The database is managed using SQLAlchemy. You can initialize the database by running the following commands in the server directory:

    flask db init
    flask db migrate
    flask db upgrade

This will create the necessary tables in the database. You can check the migrations folder for the migration scripts.

2. Seeding the Database

In order to populate the database with initial data (trips), you can use the seed.py script.

Run the Seed Script: To seed the database with some initial trip data, run the following command from the server directory:

    python seed.py

This will populate the database with sample trip data so that you can start testing the application immediately.

Verify the Seeded Data: After running the seed script, you can verify that the data was seeded correctly by checking the database or by querying the trips endpoint (GET /trips) via Postman or a similar tool.

3. Frontend Setup

The frontend of the application is built using React. Follow the instructions in the client/README.md to set up the client-side application.
Client Setup Instructions

Navigate to the client directory:

    cd client

Install the required dependencies for the frontend:

    npm install

Start the React development server:

    npm start

This will start the React app at http://localhost:5173. The app will automatically connect to the backend running on http://localhost:5555.

4. API Documentation

The API exposed by the Flask backend follows RESTful principles. Below are some of the key endpoints:

    GET /trips: Retrieves all trips.
    POST /trips: Creates a new trip.
    PATCH /trips/{id}: Updates an existing trip by ID.
    DELETE /trips/{id}: Deletes a trip by ID.

For further details on API endpoints, refer to the backend code in the server directory.