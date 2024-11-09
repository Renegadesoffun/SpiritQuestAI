import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';

const DreamWeaver = ({ navigation }) => {
  const [dreamName, setDreamName] = useState('');
  const [dreamDescription, setDreamDescription] = useState('');
  const [dreamElements, setDreamElements] = useState([]);
  const [createdDreams, setCreatedDreams] = useState([]);
  const [isCreating, setIsCreating] = useState(true);

  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const addDreamElement = (element) => {
    setDreamElements([...dreamElements, element]);
  };

  const createDream = () => {
    const newDream = {
      name: dreamName,
      description: dreamDescription,
      elements: dreamElements,
    };
    setCreatedDreams([...createdDreams, newDream]);
    setDreamName('');
    setDreamDescription('');
    setDreamElements([]);
  };

  const exploreDream = (dream) => {
    navigation.navigate('DreamExplorer', { dream });
  };

  const renderDreamElement = ({ item }) => (
    <View style={styles.elementContainer}>
      <Text style={styles.elementText}>{item}</Text>
    </View>
  );

  const renderCreatedDream = ({ item }) => (
    <TouchableOpacity style={styles.dreamItem} onPress={() => exploreDream(item)}>
      <Text style={styles.dreamName}>{item.name}</Text>
      <Text style={styles.dreamDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#1a237e', '#4a148c', '#311b92']} style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <LottieView
          source={require('../assets/dream-weaver-animation.json')}
          autoPlay
          loop
          style={styles.animation}
        />
        {isCreating ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Dream Name"
              placeholderTextColor="#9e9e9e"
              value={dreamName}
              onChangeText={setDreamName}
            />
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Dream Description"
              placeholderTextColor="#9e9e9e"
              value={dreamDescription}
              onChangeText={setDreamDescription}
              multiline
            />
            <View style={styles.elementsContainer}>
              <TouchableOpacity style={styles.addButton} onPress={() => addDreamElement('Peaceful Meadow')}>
                <Text style={styles.buttonText}>Add Peaceful Meadow</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addButton} onPress={() => addDreamElement('Mystical Forest')}>
                <Text style={styles.buttonText}>Add Mystical Forest</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addButton} onPress={() => addDreamElement('Cosmic Ocean')}>
                <Text style={styles.buttonText}>Add Cosmic Ocean</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={dreamElements}
              renderItem={renderDreamElement}
              keyExtractor={(item, index) => index.toString()}
              style={styles.elementsList}
            />
            <TouchableOpacity style={styles.createButton} onPress={createDream}>
              <Text style={styles.buttonText}>Weave Dream</Text>
            </TouchableOpacity>
          </>
        ) : (
          <FlatList
            data={createdDreams}
            renderItem={renderCreatedDream}
            keyExtractor={(item, index) => index.toString()}
            style={styles.dreamsList}
          />
        )}
        <TouchableOpacity style={styles.toggleButton} onPress={() => setIsCreating(!isCreating)}>
          <Text style={styles.buttonText}>{isCreating ? 'Explore Dreams' : 'Create New Dream'}</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  animation: {
    width: 200,
    height: 200,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: '#fff',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  elementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  elementsList: {
    width: '100%',
    marginTop: 10,
  },
  elementContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  elementText: {
    color: '#fff',
  },
  createButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  dreamsList: {
    width: '100%',
  },
  dreamItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  dreamName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dreamDescription: {
    color: '#e0e0e0',
    marginTop: 5,
  },
  toggleButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
});

export default DreamWeaver;
