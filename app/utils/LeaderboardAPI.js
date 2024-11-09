const API_URL = 'http://your-server-url.com';

export const submitScore = async (playerName, score) => {
  try {
    const response = await fetch(`${API_URL}/submit-score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ playerName, score }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error submitting score:', error);
  }
};

export const getLeaderboard = async () => {
  try {
    const response = await fetch(`${API_URL}/leaderboard`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};
