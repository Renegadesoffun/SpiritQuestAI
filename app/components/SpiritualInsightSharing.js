import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { captureRef } from 'react-native-view-shot';

const spiritualQuotes = [
  "The only true wisdom is in knowing you know nothing. - Socrates",
  "Peace comes from within. Do not seek it without. - Buddha",
  "The soul becomes dyed with the color of its thoughts. - Marcus Aurelius",
  "The wound is the place where the Light enters you. - Rumi",
  "We are not human beings having a spiritual experience. We are spiritual beings having a human experience. - Pierre Teilhard de Chardin"
];

const SpiritualInsightSharing = () => {
  const [currentQuote, setCurrentQuote] = useState(spiritualQuotes[0]);

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * spiritualQuotes.length);
    setCurrentQuote(spiritualQuotes[randomIndex]);
  };

  const shareQuote = async () => {
    try {
      const result = await Share.share({
        message: currentQuote,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('shared with activity type of', result.activityType);
        } else {
          console.log('shared');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('dismissed');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const shareScreenshot = async () => {
    try {
      const uri = await captureRef(this.viewRef, {
        format: 'png',
        quality: 0.8,
      });
      const result = await Share.share({
        url: uri,
        message: currentQuote,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('shared with activity type of', result.activityType);
        } else {
          console.log('shared');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('dismissed');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container} ref={ref => (this.viewRef = ref)}>
      <Text style={styles.quote}>{currentQuote}</Text>
      <TouchableOpacity style={styles.button} onPress={getRandomQuote}>
        <Text style={styles.buttonText}>New Quote</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={shareQuote}>
        <Text style={styles.buttonText}>Share Quote</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={shareScreenshot}>
        <Text style={styles.buttonText}>Share Screenshot</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1c092c',
  },
  quote: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SpiritualInsightSharing;
