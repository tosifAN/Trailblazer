// Function to send the request to the API and get obstacle positions
export async function getObstaclePositions(gameOptions, player, matrix) {
    try {
        // API endpoint
        const apiUrl = "http://localhost:8080/generate-obstacles"; // Replace with your actual endpoint
        
        player = {
            posX: player.posX,
            posY: player.posY,
        };
        // Prepare the request body
        const requestBody = {
            gameOptions: gameOptions,
            player: player,
            matrix: matrix
        };
        console.log("Sending request to API:", JSON.stringify(requestBody));

        // Make the POST request
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        // Parse the JSON response
        const data = await response.json();

        return data;
    } catch (error) {
        console.error("Error fetching obstacle positions:", error);
        return [];
    }
}