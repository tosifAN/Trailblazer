# Maze Game Project
Medium Article Link : https://medium.com/@tosif1355/developed-a-game-using-phaserjs-reactjs-expressjs-and-aws-services-9c6cfc6db661
## Overview
The **Maze Game** project is a fun and interactive web-based game where users navigate through a maze. The project consists of two main components:

1. **Backend**: An Express.js server for handling API requests and managing game logic.
2. **Frontend**: A React.js application with Phaser.js for rendering the maze and game mechanics.

The project is hosted on AWS services:
- **AWS Elastic Beanstalk**: Hosts the backend server.
- **AWS Amplify Hosting**: Hosts the frontend React application.

---

## Features
- **Dynamic Maze Generation**: The maze is dynamically created for each session.
- **Real-Time Gameplay**: Players can navigate through the maze with smooth controls.
- **AWS Integration**: Backend and frontend are deployed using AWS for scalability.
- **Cloud Storage**: Assets and configuration are stored in AWS S3.

---

## Tech Stack
### Frontend
- React.js
- Phaser.js

### Backend
- Node.js
- Express.js

### AWS Services
- AWS Elastic Beanstalk
- AWS Amplify Hosting
- AWS S3 (for static assets)
- AWS IAM (for role management)

---

## Installation and Setup

### Prerequisites
Ensure you have the following installed on your system:
- Node.js (>=16.x.x)
- npm (>=8.x.x)
- AWS CLI
- Git

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the `backend` directory and add the following:
   ```env
   PORT=5000
   DATABASE_URL=<your-database-url>
   ```

4. Run the server locally:
   ```bash
   npm start
   ```

5. Deploy to AWS Elastic Beanstalk:
   - Install Elastic Beanstalk CLI:
     ```bash
     pip install awsebcli
     ```
   - Initialize the Elastic Beanstalk environment:
     ```bash
     eb init
     ```
   - Deploy the application:
     ```bash
     eb create
     ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the application locally:
   ```bash
   npm start
   ```

4. Build the application for production:
   ```bash
   npm run build
   ```

5. Deploy to AWS Amplify Hosting:
   - Connect your GitHub repository to AWS Amplify Hosting.
   - Configure build settings (Amplify will automatically detect React).

---

## AWS Configuration
### IAM Role Setup
1. Create an IAM role with the following policies:
   - `AWSElasticBeanstalkFullAccess`
   - `AmazonS3FullAccess`

2. Attach the role to your Elastic Beanstalk environment.

### S3 Bucket Setup
1. Create an S3 bucket for storing assets.
2. Upload any static assets needed for the game (e.g., images, sounds).
3. Configure the bucket for public access (if required).

### Elastic Beanstalk Configuration
1. Use the following instance types for free-tier eligibility:
   - `t2.micro`
   - `t3.micro`

2. Enable enhanced health monitoring in the Elastic Beanstalk environment.

---

## Project Structure
```plaintext
maze-game-project/
|-- backend/
|   |-- src/
|   |   |-- routes/
|   |   |-- controllers/
|   |-- .env
|   |-- server.js
|   |-- package.json
|
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- components/
|   |   |-- assets/
|   |   |-- App.js
|   |-- package.json
|
|-- README.md
```

---

## API Endpoints
### Base URL
```
https://<your-elastic-beanstalk-domain>/api
```

### Endpoints
| Method | Endpoint           | Description                |
|--------|--------------------|----------------------------|
| GET    | `/maze`            | Fetches the maze layout    |
| POST   | `/update`          | Updates game state         |
| GET    | `/health`          | Checks server health       |

---

## Gameplay Mechanics
1. The maze is rendered using Phaser.js on the frontend.
2. Obstacles are dynamically updated using game logic in `GameScene.js`.
3. API calls update the backend with the player's progress.

---

## Deployment URLs
- **Frontend**: `https://<your-amplify-domain>`
- **Backend**: `https://<your-elastic-beanstalk-domain>`

---

## Contributing
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-branch
   ```
3. Make changes and commit:
   ```bash
   git commit -m "Description of changes"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-branch
   ```
5. Create a pull request.

---

## License
This project is licensed under the MIT License.
