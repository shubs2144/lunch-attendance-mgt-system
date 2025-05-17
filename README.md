Running the Attendance and Lunch Management System
Prerequisites

Node.js (v14+ recommended)
MongoDB installed locally or MongoDB Atlas account
npm or yarn package manager

Steps to Run the Application
1. Install Dependencies
From the root directory, run:
bash# Install root dependencies (including concurrently)
npm install

# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies
cd client
npm install
cd ..
Alternatively, use the script from the root directory:
bashnpm run install-all
2. Configure Environment Variables
Create or modify the server/config/config.env file (already configured in this guide). Make sure to:

Set your MongoDB connection string
Generate a secure JWT_SECRET
Configure email settings if needed

3. Start MongoDB
Ensure MongoDB is running locally on the default port (27017), or use MongoDB Atlas.
bash# Start MongoDB locally (MacOS/Linux)
mongod

# On Windows, start MongoDB from the installed service or use:
# C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe
4. Run the Application
From the root directory, run:
bashnpm start
This will start both the server and client concurrently:

Server: http://localhost:5000
Client: http://localhost:3000

5. Accessing the Application
Open your browser and navigate to:
http://localhost:3000
Development Mode
To run only the backend:
bashnpm run server
To run only the frontend:
bashnpm run client
Troubleshooting Common Issues
CORS Errors
If you're still experiencing CORS issues:

Check that server is running on port 5000
Verify the CORS configuration in server/app.js
Make sure axios is using the correct base URL in client/src/index.js

MongoDB Connection Issues
If MongoDB won't connect:

Check if MongoDB is running (mongo command in terminal)
Verify your connection string in config.env
Try using MongoDB Atlas instead of local MongoDB

JWT Authentication Issues
If authentication is failing:

Check that the JWT_SECRET is properly set in config.env
Verify the token is being properly stored in localStorage
Check that the token is being included in API requests

Email Sending Issues
If emails aren't sending:

In development, check the console for the Ethereal preview URL
Verify your SMTP configuration in config.env
Consider using a service like Mailtrap for testing emails
