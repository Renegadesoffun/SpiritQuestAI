import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useDispatch } from 'react-redux';
import { updateStats } from '../redux/playerSlice';

const PurpleScreenOfEnlightenment = ({ navigation, route }) => {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const { musicGenerator } = route.params || {};
  
  const [errors, setErrors] = useState([]);
  const [enlightenment, setEnlightenment] = useState(0);
  const [questComplete, setQuestComplete] = useState(false);

  useEffect(() => {
    generateErrors();
    musicGenerator.playSoundEffect('error');
    if (musicGenerator) {
      musicGenerator.playSoundEffect('purpleEnlightenment');
    }
  }, []);

  const generateErrors = () => {
    const newErrors = [
      "ReferenceError: Property 'theme' doesn't exist",
      "Error: useTheme must be used within a ThemeProvider",
      "TypeError: Cannot read property 'background' of undefined",
      "Error: Requiring unknown module",
      "SyntaxError: Unexpected token",
    ];
    setErrors(newErrors.map((text, index) => ({ id: index, text })));
  };

  const resolveError = (errorId) => {
    setErrors(errors.filter(error => error.id !== errorId));
    setEnlightenment(enlightenment + 20);
    musicGenerator.playSoundEffect('resolve');
    toggleTheme(); // Toggle between default and purple theme
    if (errors.length === 1) {
      setQuestComplete(true);
    }
  };

  const renderErrors = () => {
    return errors.map(error => (
      <TouchableOpacity key={error.id} onPress={() => resolveError(error.id)}>
        <Text style={styles.errorText}>{error.text}</Text>
      </TouchableOpacity>
    ));
  };

  if (questComplete) {
    dispatch(updateStats({ wisdom: enlightenment, debugging: enlightenment }));
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.completionText, { color: theme.text }]}>Enlightenment Achieved!</Text>
        <Text style={[styles.enlightenmentText, { color: theme.text }]}>Debugging Enlightenment: {enlightenment}</Text>
        <Text style={[styles.messageText, { color: theme.text }]}>
          You have transcended the purple screen of errors. 
          In the process, you've realized that errors are not obstacles, but opportunities for growth.
          The purple void is not an end, but a beginning of new understanding.
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('MainMenu')}
        >
          <Text style={styles.buttonText}>Return to Main Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Purple Screen of Enlightenment</Text>
      {renderErrors()}
      <Text style={[styles.enlightenmentText, { color: theme.text }]}>Debugging Enlightenment: {enlightenment}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
  },
  enlightenmentText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  completionText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  messageText: {
    fontSize: 18,
    marginVertical: 20,
    textAlign: 'center',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default PurpleScreenOfEnlightenment;
