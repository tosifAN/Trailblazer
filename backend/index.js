import express from 'express';
import bodyParser from 'body-parser';
import { DynamoDBClient, PutItemCommand, UpdateItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import AWS from 'aws-sdk';
import cors from 'cors';

const app = express();
const PORT = 8080;

const corsOptions = {
    origin: 'https://main.d2tuoguls1lw9z.amplifyapp.com', // Allow requests from your frontend only
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type'], // Allow only the Content-Type header
    credentials: true, // If you need cookies or credentials
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight handling



app.use(bodyParser.json());


// DynamoDB client setup
const dynamoDBClient = new DynamoDBClient({
    region: 'us-east-1', // Replace with your AWS region
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Replace with your AWS access key
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Replace with your AWS secret key
    },
});

AWS.config.update({ 
    region: 'us-east-1', // Replace with your AWS region
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Replace with your AWS access key
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Replace with your AWS secret key
    }, });

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

function extractObstaclePositions(response) {
    // Get the text content from the response
    const responseText = response.obstacles.outputs[0].text;

    // Use a regular expression to extract all (x, y) positions
    const positions = responseText.match(/\(\d+,\s*\d+\)/g);

    // Return the extracted positions as an array of objects
    return positions ? positions.map(position => {
        const [x, y] = position.replace(/[()]/g, '').split(',').map(Number);
        return { x, y };
    }) : [];
}

// Utility function to create dynamic obstacles
async function createDynamicObstacles(gameOptions, player, matrix) {
    const bedrockRuntime = new AWS.BedrockRuntime();

    const params = {
        modelId: 'mistral.mistral-7b-instruct-v0:2',
        contentType: 'application/json', // Content-Type header
        accept: 'application/json',      // Accept header
        body: JSON.stringify({
            prompt: `<s>[INST] Do not write any additional text, only obstacle positions as a list of (x, y) coordinates.for a maze game in the format (x, y):
                    - Maze size: ${gameOptions.mazeWidth}x${gameOptions.mazeHeight}
                    - Current player position: (${player.posX}, ${player.posY})
                    - 0 is a path and 1 is the wall
                    - Ensure the path remains solvable
                    - Existing maze matrix: ${JSON.stringify(matrix)}
                    -  [/INST]</s>`,
            max_tokens: 200,
            temperature: 0.5,
            top_p: 0.9,
            top_k: 50,
        }),
    };
    

    try {
        const response = await bedrockRuntime.invokeModel(params).promise();
        const obstaclePattern = JSON.parse(response.body);
        return obstaclePattern;
    } catch (error) {
        console.error('Error generating obstacles:', error);
        return [];
    }
}

// POST endpoint to generate dynamic obstacles
app.post('/generate-obstacles', async (req, res) => {
    try {
        const { gameOptions, player, matrix } = req.body;

        // Validate required fields
        if (!gameOptions || !player || !gameOptions.mazeWidth || !gameOptions.mazeHeight || !player.posX || !player.posY) {
            return res.status(400).json({ error: 'Missing required gameOptions or player data.' });
        }

        const obstacles = await createDynamicObstacles(gameOptions, player,matrix);
        const obstaclePositions = extractObstaclePositions({obstacles});
        res.status(200).json({ obstaclePositions });
    } catch (error) {
        console.error('Error generating dynamic obstacles:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
