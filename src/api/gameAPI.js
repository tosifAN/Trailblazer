// API endpoints configuration
const API_BASE_URL = 'https://uoubhywcxa.execute-api.us-east-1.amazonaws.com';

/**
 * Saves a new player's data to the server.
 *
 * @async
 * @function savePlayer
 * @param {string} PlayerID - The unique identifier for the player.
 * @param {string} PlayerEmailID - The email address associated with the player.
 * @param {string} PlayerName - The name of the player.
 * @param {number} PlayerLevel - The current level of the player in the game.
 * @param {number} PlayerTime - The time taken by the player to complete the current level.
 * @returns {Promise<Object>} A promise that resolves to the JSON response from the server.
 * @throws {Error} Throws an error if there was an issue with the fetch request.
 */
export const savePlayer = async (PlayerID, PlayerEmailID, PlayerName, PlayerLevel, PlayerTime) => {
    try {
        const response = await fetch(`${API_BASE_URL}/save-player`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({PlayerID, PlayerEmailID, PlayerName, PlayerLevel, PlayerTime}),
        });
        return await response.json();
    } catch (error) {
        console.error('Error saving player:', error);
        throw error;
    }
};

/**
 * Updates the player's data on the server.
 *
 * @async
 * @function updatePlayer
 * @param {string} playerID - The unique identifier for the player.
 * @param {Object} updateData - An object containing the updated data for the player. It can include properties like PlayerEmailID, PlayerName, PlayerLevel, and PlayerTime.
 * @returns {Promise<Object>} A promise that resolves to the JSON response from the server.
 * @throws {Error} Throws an error if there was an issue with the fetch request.
 */
export const updatePlayer = async (playerID, updateData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/update-player/?PlayerID=${playerID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });
        return await response.json();
    } catch (error) {
        console.error('Error updating player:', error);
        throw error;
    }
};




/**
 * Fetches the leaderboard data from the server.
 *
 * @async
 * @function fetchLeaderboard
 * @returns {Promise<Array>} A promise that resolves to an array of leaderboard data. Each object in the array represents a player and includes properties such as PlayerID, PlayerEmailID, PlayerName, PlayerLevel, and PlayerTime.
 * @throws {Error} Throws an error if there was an issue with the fetch request.
 */
export const fetchLeaderboard = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/leaderboard`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        throw error;
    }
};