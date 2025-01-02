// API endpoints configuration
const API_BASE_URL = 'http://localhost:8080';

export const savePlayer = async (PlayerID, PlayerEmailID,  PlayerName, PlayerLevel, PlayerTime) => {
    try {
        console.log("this data " , JSON.stringify({PlayerID, PlayerEmailID,  PlayerName, PlayerLevel, PlayerTime}));
        const response = await fetch(`${API_BASE_URL}/save-player`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({PlayerID, PlayerEmailID,  PlayerName, PlayerLevel, PlayerTime}),
        });
        return await response.json();
    } catch (error) {
        console.error('Error saving player:', error);
        throw error;
    }
};

export const updatePlayer = async (playerID, updateData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/update-player/?PlayerID=${playerID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });
        console.log("response", response);
        return await response.json();
    } catch (error) {
        console.error('Error updating player:', error);
        throw error;
    }
};

export const fetchLeaderboard = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/leaderboard`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        throw error;
    }
};