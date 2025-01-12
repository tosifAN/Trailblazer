
Medium Link : https://medium.com/@tosif1355/developed-a-game-using-phaserjs-reactjs-expressjs-and-aws-services-9c6cfc6db661

# Trailblazer: A Maze Game

## Overview
The **Maze Game** project is a fun and interactive web-based game where users navigate through a maze. The project consists of two main components:


## 🌟 Overview
**Trailblazer** is a dynamic web-based game where players navigate through progressively challenging mazes, competing for the top spot on a global leaderboard. Built using cutting-edge technologies and deployed with AWS services, this game is a showcase of modern web development and cloud computing.

---

## 🎮 Features
- **Dynamic Maze Generation**: Each game session features uniquely generated mazes.  
- **Global Leaderboard**: Players can track their rankings in real-time.  
- **AI-Powered Obstacles**: Amazon Bedrock generates dynamic maze obstacles to keep gameplay engaging.  
- **Cloud Integration**: Seamless backend and frontend integration using AWS services.  
- **Responsive Gameplay**: Smooth controls and compatibility across multiple devices.

---

## 🛠️ Tech Stack
### **Frontend**
- React.js
- Phaser.js (for interactive game mechanics)

### **Backend**
- Node.js with Express.js
- Hosted on AWS Elastic Beanstalk

### **AWS Services**
- **AWS Amplify**: For hosting the React-based frontend.  
- **AWS Elastic Beanstalk**: For scalable backend hosting.  
- **AWS DynamoDB**: For storing player scores and leaderboard data.  
- **AWS S3**: For managing static assets like game music and additional resources.  
- **Amazon Bedrock**: To dynamically generate obstacles in the maze.  
- **Amazon EC2**: For robust and scalable compute capabilities.  
- **AWS API Gateway**: For secure and efficient API management.

---

## 🚀 Installation and Setup

### Prerequisites
Make sure you have the following installed:
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
   Create a `.env` file in the backend directory and include:  
   ```env
   PORT=5000
   DATABASE_URL=<your-dynamodb-endpoint>
   ```
4. Start the server locally:  
   ```bash
   npm start
   ```
5. Deploy to AWS Elastic Beanstalk:  
   - Install the Elastic Beanstalk CLI:  
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
5. Deploy to AWS Amplify:  
   - Connect your GitHub repository to AWS Amplify.  
   - Follow the prompts to configure the build and deployment settings.

---

## 🌐 API Endpoints
### Base URL
```
https://<your-elastic-beanstalk-domain>/api
```

### Available Endpoints
| Method | Endpoint           | Description                |
|--------|--------------------|----------------------------|
| GET    | `/maze`            | Fetches the maze layout    |
| POST   | `/submit-score`    | Submits the player score   |
| GET    | `/leaderboard`     | Retrieves leaderboard data |

---

## 🛠️ AWS Configuration
### IAM Role Setup
1. Create an IAM role with policies for:
   - `AWSElasticBeanstalkFullAccess`
   - `AmazonS3FullAccess`
   - `AmazonDynamoDBFullAccess`

2. Attach the IAM role to your Elastic Beanstalk environment.

### S3 Bucket Setup
1. Create an S3 bucket to store game assets.  
2. Upload assets like images, soundtracks, and configuration files.  
3. Adjust bucket policies for public access, if needed.

### DynamoDB Configuration
1. Create a table named `Leaderboard` with the following structure:  
   - **Partition Key**: `playerID` (String)  
   - **Sort Key**: `score` (Number)  
2. Configure your backend to use this table for storing and retrieving data.


## 🌟 Future Enhancements
- **Multiplayer Mode**: Real-time competitive gameplay.  
- **Timed Challenges**: Add time-based game modes for increased difficulty.  
- **Mobile Version**: Expand accessibility by developing a mobile-friendly version.  
- **Player Analytics**: Leverage AI to analyze player performance and provide insights.  
- **Custom Levels**: Enable players to create and share their own mazes.

---

## 🤝 Contributing
We welcome contributions to improve **Trailblazer**! To contribute:  
1. Fork the repository.  
2. Create a new branch:  
   ```bash
   git checkout -b feature-name
   ```
3. Make changes and commit them:  
   ```bash
   git commit -m "Description of changes"
   ```
4. Push to your forked repository:  
   ```bash
   git push origin feature-name
   ```
5. Open a pull request on the main repository.

---

## 📜 License
This project is licensed under the MIT License. See the LICENSE file for more details.
```
