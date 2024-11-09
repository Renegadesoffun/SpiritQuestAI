import React, { useState, useEffect, useRef } from 'react';

import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions, Image } from 'react-native';

import { Audio } from 'expo-av';

import LottieView from 'lottie-react-native';

import { useQuantum, QuantumEffect } from './QuantumEntanglement';

import { LinearGradient } from 'expo-linear-gradient';

import SpiritRealmTheme from '../audio/SpiritRealmTheme';

import SpiritGuideAnimation from '../animations/SpiritGuideAnimation';

import MusicComposer from '../audio/MusicComposer';



const { width, height } = Dimensions.get('window');



const WonderlandRealm = ({ navigation, onScoreUpdate }) => {

  const [reality, setReality] = useState(1);

  const [currentQuote, setCurrentQuote] = useState('');

  const [score, setScore] = useState(0);

  const [playerPosition, setPlayerPosition] = useState({ x: width / 2, y: height / 2 });

  const [gravity, setGravity] = useState(1);

  const [timeDirection, setTimeDirection] = useState(1);

  const [sound, setSound] = useState();

  const sizeAnim = useRef(new Animated.Value(1)).current;

  const rotateAnim = useRef(new Animated.Value(0)).current;

  const { quantumState, setQuantumState } = useQuantum();

  const [inSpiritRealm, setInSpiritRealm] = useState(false);
  const [spiritGuideVisible, setSpiritGuideVisible] = useState(false);
  const [spiritMessage, setSpiritMessage] = useState('');
  const [spiritRealmMusic] = useState(new SpiritRealmTheme());



  const wonderlandQuotes = [

    "Why, sometimes I've believed as many as six impossible things before breakfast.",

    "We're all mad here.",

    "Curiouser and curiouser!",

    "If you don't know where you are going any road can take you there.",

    "It's no use going back to yesterday, because I was a different person then."

  ];



  useEffect(() => {
    const startRealm = async () => {
      try {
        // Start with base wonderland ambience
        await MusicComposer.playRealmAmbience('wonderland');
        
        // Add ethereal bells on interval
        const bellInterval = setInterval(() => {
          MusicComposer.playBellSequence(['D6', 'A6', 'F#6'], 0.08);
        }, 8000);
        
        // Add crystal sounds
        const crystalInterval = setInterval(() => {
          if (Math.random() < 0.3) {
            MusicComposer.playCrystalSound('B5', 0.06);
          }
        }, 3000);

        startAnimation();
        setRandomQuote();

        return () => {
          clearInterval(bellInterval);
          clearInterval(crystalInterval);
          MusicComposer.stopAll();
        };
      } catch (err) {
        console.warn('Failed to start wonderland realm:', err);
      }
    };

    startRealm();
  }, []);





  const loadSound = async () => {
    try {
      await AudioEngine.playSound('wonderland', 0, 0.3); // Infinite duration
    } catch (err) {
      console.warn('Failed to load wonderland sound:', err);
    }
  };



  const startAnimation = () => {

    Animated.loop(

      Animated.parallel([

        Animated.sequence([

          Animated.timing(sizeAnim, { toValue: 1.2, duration: 2000, useNativeDriver: true }),

          Animated.timing(sizeAnim, { toValue: 0.8, duration: 2000, useNativeDriver: true }),

        ]),

        Animated.timing(rotateAnim, { toValue: 1, duration: 4000, useNativeDriver: true }),

      ])

    ).start();

  };



  const setRandomQuote = () => {

    const randomIndex = Math.floor(Math.random() * wonderlandQuotes.length);

    setCurrentQuote(wonderlandQuotes[randomIndex]);

  };



  const changeReality = () => {
    setReality(prevReality => (prevReality % 3) + 1);
    setRandomQuote();
    setGravity(Math.random() * 2 - 1);
    setTimeDirection(Math.random() > 0.5 ? 1 : -1);
    
    // Play reality shift music sequence
    MusicComposer.playGameEvent('enterPortal', {
      progression: ['D4', 'F#4', 'A4', 'D5'],
      durations: [0.5, 0.5, 0.5, 2],
      volume: 0.3
    });
    
    setScore(prevScore => prevScore + 10);
    onScoreUpdate(score + 10);
  };



  const applyQuantumEffect = () => {

    const newState = Math.random() > 0.5 ? 'superposition' : 'entanglement';

    setQuantumState(newState);

    setScore(prevScore => prevScore + 5);

    onScoreUpdate(score + 5);

  };



  const updateGameState = () => {

    setPlayerPosition(prevPos => ({

      x: prevPos.x + (Math.random() * 10 - 5) * timeDirection,

      y: prevPos.y + gravity * timeDirection

    }));



    // Wrap around screen edges

    if (playerPosition.x > width) setPlayerPosition(prevPos => ({ ...prevPos, x: 0 }));

    if (playerPosition.x < 0) setPlayerPosition(prevPos => ({ ...prevPos, x: width }));

    if (playerPosition.y > height) setPlayerPosition(prevPos => ({ ...prevPos, y: 0 }));

    if (playerPosition.y < 0) setPlayerPosition(prevPos => ({ ...prevPos, y: height }));

  };



  const spin = rotateAnim.interpolate({

    inputRange: [0, 1],

    outputRange: ['0deg', '360deg'],

  });



  const transitionToSpiritRealm = () => {
    setInSpiritRealm(true);
    spiritRealmMusic.play();
  };

  const showSpiritGuide = () => {
    setSpiritGuideVisible(true);
    const messages = [
      "You are perfect as you are.",
      "All in all is all we are.",
      "The universe is within you.",
      "You are the dreamer and the dream.",
      "In silence, you will find your true self.",
    ];
    setSpiritMessage(messages[Math.floor(Math.random() * messages.length)]);
    
    // Offer character upgrade
    setScore(prevScore => prevScore + 20);
    onScoreUpdate(score + 20);

    setTimeout(() => {
      setSpiritGuideVisible(false);
      setSpiritMessage('');
    }, 5000);
  };

  useEffect(() => {
    if (inSpiritRealm && Math.random() < 0.1) { // 10% chance every frame
      showSpiritGuide();
    }
    return () => {
      spiritRealmMusic.stop();
    };
  }, [inSpiritRealm, playerPosition]);



  return (

    <LinearGradient

      colors={inSpiritRealm ? ['#4a0e4e', '#89229b', '#c12ecf'] : ['#ff6b6b', '#feca57', '#48dbfb']}

      style={styles.container}

    >

      <Animated.View style={[styles.wonderland, { transform: [{ scale: sizeAnim }, { rotate: spin }] }]}>

        <LottieView

          source={require('../assets/wonderland-animation.json')}

          autoPlay

          loop

          style={styles.animation}

        />

      </Animated.View>

      <Text style={styles.quoteText}>{currentQuote}</Text>

      <Animated.Image

        source={require('../assets/alice-sprite.png')}

        style={[

          styles.player,

          {

            transform: [

              { translateX: playerPosition.x },

              { translateY: playerPosition.y },

              { rotate: spin },

              { scaleX: timeDirection },

            ]

          }

        ]}

      />

      <TouchableOpacity style={styles.realityButton} onPress={changeReality}>

        <Text style={styles.buttonText}>Change Reality</Text>

      </TouchableOpacity>

      <TouchableOpacity style={styles.quantumButton} onPress={applyQuantumEffect}>

        <Text style={styles.buttonText}>Quantum Leap</Text>

      </TouchableOpacity>

      <Text style={styles.scoreText}>Score: {score}</Text>

      <Text style={styles.realityText}>Current Reality: {reality}</Text>

      <Text style={styles.quantumText}>Quantum State: {quantumState}</Text>

      <QuantumEffect />

      {inSpiritRealm && (
        <Animated.View style={[styles.spiritRealmOverlay, { opacity: sizeAnim }]}>
          <Text style={styles.spiritRealmText}>Welcome to the Spirit Realm</Text>
        </Animated.View>
      )}

      {spiritGuideVisible && (
        <View style={styles.spiritGuideContainer}>
          <SpiritGuideAnimation />
          <Text style={styles.spiritMessage}>{spiritMessage}</Text>
        </View>
      )}

      {!inSpiritRealm && (
        <TouchableOpacity style={styles.transitionButton} onPress={transitionToSpiritRealm}>
          <Text style={styles.transitionButtonText}>Enter Spirit Realm</Text>
        </TouchableOpacity>
      )}

    </LinearGradient>

  );

};



const styles = StyleSheet.create({

  container: {

    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',

  },

  wonderland: {

    width: width * 0.8,

    height: height * 0.4,

    justifyContent: 'center',

    alignItems: 'center',

  },

  animation: {

    width: '100%',

    height: '100%',

  },

  quoteText: {

    fontSize: 18,

    fontStyle: 'italic',

    textAlign: 'center',

    marginHorizontal: 20,

    marginBottom: 20,

    color: '#fff',

  },

  player: {

    width: 50,

    height: 50,

    position: 'absolute',

  },

  realityButton: {

    backgroundColor: '#ff9ff3',

    padding: 15,

    borderRadius: 25,

    marginTop: 20,

  },

  quantumButton: {

    backgroundColor: '#54a0ff',

    padding: 15,

    borderRadius: 25,

    marginTop: 20,

  },

  buttonText: {

    color: '#fff',

    fontSize: 18,

    fontWeight: 'bold',

  },

  scoreText: {

    fontSize: 24,

    fontWeight: 'bold',

    color: '#fff',

    marginTop: 20,

  },

  realityText: {

    marginTop: 10,

    fontSize: 16,

    color: '#fff',

  },

  quantumText: {

    marginTop: 10,

    fontSize: 16,

    color: '#fff',

  },

  spiritRealmOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  spiritRealmText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  spiritGuideContainer: {
    position: 'absolute',
    top: '20%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  spiritGuideAnimation: {
    width: 150,
    height: 150,
  },
  spiritMessage: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
  },
  transitionButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 10,
    borderRadius: 20,
  },
  transitionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

});

export default WonderlandRealm;
