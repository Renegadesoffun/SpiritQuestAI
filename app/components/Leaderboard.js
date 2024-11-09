import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getLeaderboard } from './LeaderboardAPI';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const data = await getLeaderboard();
      setLeaderboardData(data);
    };
    fetchLeaderboard();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <FlatList
        data={leaderboardData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <Text style={styles.rank}>{index + 1}</Text>
            <Text style={styles.name}>{item.playerName}</Text>
            <Text style={styles.score}>{item.score}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // ... styles for the leaderboard
});

export default Leaderboard;
