import React, { useState, useEffect } from 'react';



import { View, StyleSheet, PanResponder, Animated, Text, Image } from 'react-native';



import { Audio } from 'expo-av';



import LottieView from 'lottie-react-native';







const CELL_SIZE = 40;



const PLAYER_SIZE = 30;



const EMOTIONS = ['Joy', 'Sadness', 'Anger', 'Fear', 'Love'];



const EMOTION_COLORS = {



  Joy: '#FFD700',



  Sadness: '#4169E1',



  Anger: '#FF4500',



  Fear: '#800080',



  Love: '#FF69B4',



};







const EmotionalLabyrinth = ({ navigation }) => {



  const [maze, setMaze] = useState([]);



  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });



  const [currentEmotion, setCurrentEmotion] = useState('');



  const [score, setScore] = useState(0);



  const [sound, setSound] = useState();



  const playerAnimation = useState(new Animated.ValueXY({ x: 0, y: 0 }))[0];







  useEffect(() => {



    generateMaze();



    setCurrentEmotion(EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)]);



    loadSound();



    return () => {



      sound?.unloadAsync();



    };



  }, []);







  const loadSound = async () => {



    // TODO: Replace with actual sound asset

    const { sound } = await Audio.Sound.createAsync(require('../assets/placeholder-emotion-chime.mp3'));



    setSound(sound);



  };







  const generateMaze = () => {



    // Implement a more complex maze generation algorithm here



    const newMaze = [



      [0, 1, 0, 0, 0, 1, 0],



      [0, 1, 1, 1, 0, 1, 0],



      [0, 0, 0, 1, 0, 0, 0],



      [1, 1, 0, 1, 1, 1, 0],



      [0, 0, 0, 0, 0, 1, 0],



      [0, 1, 1, 1, 0, 1, 0],



      [0, 0, 0, 1, 0, 0, 0],



    ];



    setMaze(newMaze);



    setPlayerPosition({ x: 0, y: 0 });



    Animated.spring(playerAnimation, {



      toValue: { x: 0, y: 0 },



      useNativeDriver: true,



    }).start();



  };







  const panResponder = PanResponder.create({



    onStartShouldSetPanResponder: () => true,



    onPanResponderMove: (_, gesture) => {



      const { dx, dy } = gesture;



      if (Math.abs(dx) > Math.abs(dy)) {



        movePlayer(dx > 0 ? 'right' : 'left');



      } else {



        movePlayer(dy > 0 ? 'down' : 'up');



      }



    },



  });







  const movePlayer = (direction) => {



    const { x, y } = playerPosition;



    let newX = x;



    let newY = y;







    switch (direction) {



      case 'up':



        newY = Math.max(0, y - 1);



        break;



      case 'down':



        newY = Math.min(maze.length - 1, y + 1);



        break;



      case 'left':



        newX = Math.max(0, x - 1);



        break;



      case 'right':



        newX = Math.min(maze[0].length - 1, x + 1);



        break;



    }







    if (maze[newY][newX] === 0) {



      setPlayerPosition({ x: newX, y: newY });



      Animated.spring(playerAnimation, {



        toValue: { x: newX * CELL_SIZE, y: newY * CELL_SIZE },



        useNativeDriver: true,



      }).start();



      checkEmotion(newX, newY);



    }



  };







  const checkEmotion = (x, y) => {



    if (x === maze[0].length - 1 && y === maze.length - 1) {



      if (EMOTIONS.indexOf(currentEmotion) === score) {



        setScore(score + 1);



        sound?.playAsync();



        if (score + 1 === EMOTIONS.length) {



          // Game complete



          navigation.navigate('LevelComplete', { score: score + 1 });



        } else {



          setCurrentEmotion(EMOTIONS[score + 1]);



          generateMaze();



        }



      }



    }



  };







  return (



    <View style={styles.container} {...panResponder.panHandlers}>



      {/* TODO: Replace with actual heart background image */}

      <Image source={require('../assets/placeholder-heart-background.png')} style={styles.backgroundImage} />



      <Text style={styles.emotion}>Find: {currentEmotion}</Text>



      <View style={styles.maze}>



        {maze.map((row, rowIndex) => (



          <View key={rowIndex} style={styles.row}>



            {row.map((cell, cellIndex) => (



              <View



                key={cellIndex}



                style={[



                  styles.cell,



                  cell === 1 ? styles.wall : styles.path,



                  rowIndex === maze.length - 1 && cellIndex === row.length - 1 ? styles.exit : null,



                ]}



              />



            ))}



          </View>



        ))}



        <Animated.View



          style={[



            styles.player,



            {



              transform: playerAnimation.getTranslateTransform(),



            },



          ]}



        >



          {/* TODO: Replace with actual heart animation */}

          <LottieView



            source={require('../assets/placeholder-heart-animation.json')}



            autoPlay



            loop



            style={styles.playerAnimation}



          />



        </Animated.View>



      </View>



      <Text style={styles.score}>Emotions Balanced: {score}/{EMOTIONS.length}</Text>



    </View>



  );



};







const styles = StyleSheet.create({



  container: {



    flex: 1,



    justifyContent: 'center',



    alignItems: 'center',



    backgroundColor: '#1e3c72',



  },



  backgroundImage: {



    ...StyleSheet.absoluteFillObject,



    opacity: 0.2,



  },



  maze: {



    borderWidth: 2,



    borderColor: '#FFF',



  },



  row: {



    flexDirection: 'row',



  },



  cell: {



    width: CELL_SIZE,



    height: CELL_SIZE,



  },



  wall: {



    backgroundColor: '#000',



  },



  path: {



    backgroundColor: 'rgba(255, 255, 255, 0.1)',



  },



  exit: {



    backgroundColor: '#4CAF50',



  },



  player: {



    position: 'absolute',



    width: PLAYER_SIZE,



    height: PLAYER_SIZE,



  },



  playerAnimation: {



    width: '100%',



    height: '100%',



  },



  emotion: {



    fontSize: 24,



    color: '#FFF',



    marginBottom: 20,



  },



  score: {



    fontSize: 18,



    color: '#FFF',



    marginTop: 20,



  },



});







export default EmotionalLabyrinth;








