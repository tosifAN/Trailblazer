import express from 'express';
import bodyParser from 'body-parser';
import { DynamoDBClient, PutItemCommand, UpdateItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import cors from 'cors';

const app = express();
const PORT = 8080;

app.use(cors());

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// DynamoDB client setup
const dynamoDBClient = new DynamoDBClient({
    region: 'us-east-1', // Replace with your AWS region
    credentials: {
        accessKeyId: 'AKIAXTORPF5KDT2CF6AU', // Replace with your AWS access key
        secretAccessKey: 'x9S0iBsvgx2jAZ0t9JkC8tg+aNlYpI4y/UKsapPr', // Replace with your AWS secret key
    },
});

// POST endpoint
app.post('/save-player', async (req, res) => {
    try {
        const { PlayerID, PlayerEmailID, PlayerLevel, PlayerName, PlayerTime } = req.body;

        // Validate required fields
        if (!PlayerID || !PlayerEmailID || !PlayerLevel || !PlayerName || !PlayerTime) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Validate numeric fields
        if (isNaN(PlayerID) || isNaN(PlayerLevel) || isNaN(PlayerTime)) {
            return res.status(400).json({ error: 'PlayerID, PlayerLevel, and PlayerTime must be valid numbers.' });
        }

        const params = {
            TableName: 'MazeGame',
            Item: {
                PlayerID: { N: `${PlayerID}` }, // Number for PlayerID
                PlayerEmailID: { S: PlayerEmailID }, // String
                PlayerLevel: { N: `${PlayerLevel}` }, // Number
                PlayerName: { S: PlayerName }, // String
                PlayerTime: { N: `${PlayerTime}` }, // Number
            },
        };

        const command = new PutItemCommand(params);
        await dynamoDBClient.send(command);

        res.status(200).json({ message: 'Data saved successfully!' });
    } catch (error) {
        console.error('Error saving data to DynamoDB:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET endpoint to fetch and sort players
app.get('/leaderboard', async (req, res) => {
    try {
        const params = {
            TableName: 'MazeGame',
        };

        const command = new ScanCommand(params);
        const data = await dynamoDBClient.send(command);

        // Map and sort players
        const players = data.Items.map((item) => ({
            PlayerID: parseInt(item.PlayerID.N, 10),
            PlayerEmailID: item.PlayerEmailID.S,
            PlayerLevel: parseInt(item.PlayerLevel.N, 10),
            PlayerName: item.PlayerName.S,
            PlayerTime: parseInt(item.PlayerTime.N, 10),
        }));

        players.sort((a, b) => {
            if (b.PlayerLevel !== a.PlayerLevel) {
                return b.PlayerLevel - a.PlayerLevel; // Descending PlayerLevel
            }
            return a.PlayerTime - b.PlayerTime; // Ascending PlayerTime
        });

         // Limit to top 10 players
         const topPlayers = players.slice(0, 10);

        // Respond with top players and total player count
        res.status(200).json({
            topPlayers: topPlayers,
            totalPlayers: players.length,
        });
    } catch (error) {
        console.error('Error fetching data from DynamoDB:', error);
        res.status(500).json({ error: error.message });
    }
});

// PUT endpoint to update player data
app.put('/update-player/', async (req, res) => {
    try {
        const { PlayerID } = req.query; // Extract PlayerID from query parameters
        const { PlayerLevel, PlayerTime } = req.body;

        // Validate numeric fields
        if (isNaN(PlayerLevel) || isNaN(PlayerTime)) {
            return res.status(400).json({ error: 'PlayerLevel and PlayerTime must be valid numbers.' });
        }

        const params = {
            TableName: 'MazeGame',
            Key: {
                PlayerID: { N: `${PlayerID}` },
            },
            UpdateExpression: 'SET PlayerLevel = :level, PlayerTime = :time',
            ExpressionAttributeValues: {
                ':level': { N: `${PlayerLevel}` },
                ':time': { N: `${PlayerTime}` },
            },
            ReturnValues: 'UPDATED_NEW',
        };

        const command = new UpdateItemCommand(params);
        const result = await dynamoDBClient.send(command);

        res.status(200).json({ message: 'Player data updated successfully!', updatedAttributes: result.Attributes });
    } catch (error) {
        console.error('Error updating data in DynamoDB:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
