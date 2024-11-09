import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { advanceChapter } from '../redux/gameProgressSlice';

const chapters = [
  {
    title: "The Awakening",
    description: "Your spiritual journey begins as you awaken to the vast potential within yourself.",
    tasks: ["Complete Mindfulness Breathing", "Finish FlappySpirit tutorial"],
  },
  {
    title: "The Path of Compassion",
    description: "You learn the importance of empathy and kindness on your spiritual path.",
    tasks: ["Complete Compassion Quest", "Help 5 spirits in FlappySpirit"],
  },
  // Add more chapters here
];

const StoryManager = ({ onChapterComplete }) => {
  const currentChapter = useSelector(state => state.gameProgress.currentChapter);
  const completedMiniGames = useSelector(state => state.gameProgress.completedMiniGames);
  const dispatch = useDispatch();

  const [tasksCompleted, setTasksCompleted] = useState(0);

  useEffect(() => {
    const completedTasks = chapters[currentChapter - 1].tasks.filter(task => 
      completedMiniGames.includes(task)
    );
    setTasksCompleted(completedTasks.length);

    if (completedTasks.length === chapters[currentChapter - 1].tasks.length) {
      dispatch(advanceChapter());
      onChapterComplete();
    }
  }, [completedMiniGames, currentChapter]);

  return (
    <View style={styles.container}>
      <Text style={styles.chapterTitle}>{chapters[currentChapter - 1].title}</Text>
      <Text style={styles.chapterDescription}>{chapters[currentChapter - 1].description}</Text>
      <Text style={styles.taskProgress}>Tasks completed: {tasksCompleted}/{chapters[currentChapter - 1].tasks.length}</Text>
      {chapters[currentChapter - 1].tasks.map((task, index) => (
        <Text key={index} style={[
          styles.task,
          completedMiniGames.includes(task) ? styles.completedTask : {}
        ]}>
          {task}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F0F4F8',
  },
  chapterTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  chapterDescription: {
    fontSize: 16,
    color: '#34495E',
    marginBottom: 20,
  },
  taskProgress: {
    fontSize: 18,
    color: '#2980B9',
    marginBottom: 10,
  },
  task: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 5,
  },
  completedTask: {
    color: '#27AE60',
    textDecorationLine: 'line-through',
  },
});

export default StoryManager;
