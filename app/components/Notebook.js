import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Notebook = () => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState('');

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('playerNotes');
      if (savedNotes !== null) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const saveNote = async () => {
    if (currentNote.trim() !== '') {
      const newNotes = [...notes, { id: Date.now(), text: currentNote }];
      setNotes(newNotes);
      setCurrentNote('');
      try {
        await AsyncStorage.setItem('playerNotes', JSON.stringify(newNotes));
      } catch (error) {
        console.error('Error saving note:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dream Journal & Notes</Text>
      <ScrollView style={styles.notesContainer}>
        {notes.map((note) => (
          <View key={note.id} style={styles.noteItem}>
            <Text>{note.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          multiline
          placeholder="Write your thoughts, dreams, or insights..."
          value={currentNote}
          onChangeText={setCurrentNote}
        />
        <TouchableOpacity style={styles.addButton} onPress={saveNote}>
          <Text style={styles.addButtonText}>Add Note</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  notesContainer: {
    flex: 1,
    marginBottom: 20,
  },
  noteItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Notebook;
