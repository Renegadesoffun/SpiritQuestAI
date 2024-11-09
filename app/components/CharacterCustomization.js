import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateCharacter } from '../redux/playerSlice';
import { useTheme } from '../theme/ThemeProvider';

const CharacterCustomization = () => {
  const dispatch = useDispatch();
  const character = useSelector(state => state.player.character);
  const { theme } = useTheme();

  const updateCharacterAttribute = (attribute, value) => {
    dispatch(updateCharacter({ [attribute]: value }));
  };

  const renderAppearanceOptions = () => (
    <View>
      <Text style={styles.sectionTitle}>Skin Tone</Text>
      <View style={styles.optionsRow}>
        {['#FFDAB9', '#F0B27A', '#CD853F', '#8B4513'].map(color => (
          <TouchableOpacity
            key={color}
            style={[styles.colorOption, { backgroundColor: color }]}
            onPress={() => updateCharacterAttribute('skinTone', color)}
          />
        ))}
      </View>
      <Text style={styles.sectionTitle}>Hair Style</Text>
      <View style={styles.optionsRow}>
        {['Short', 'Long', 'Curly', 'Bald'].map(style => (
          <TouchableOpacity
            key={style}
            style={styles.textOption}
            onPress={() => updateCharacterAttribute('hairStyle', style)}
          >
            <Text>{style}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Add more appearance options */}
    </View>
  );

  const renderPersonalityOptions = () => (
    <View>
      <Text style={styles.sectionTitle}>Personality Trait</Text>
      <View style={styles.optionsRow}>
        {['Kind', 'Brave', 'Wise', 'Creative'].map(trait => (
          <TouchableOpacity
            key={trait}
            style={styles.textOption}
            onPress={() => updateCharacterAttribute('personalityTrait', trait)}
          >
            <Text>{trait}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Add more personality options */}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Character Customization</Text>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, currentTab === 'appearance' && styles.activeTab]}
          onPress={() => setCurrentTab('appearance')}
        >
          <Text>Appearance</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, currentTab === 'personality' && styles.activeTab]}
          onPress={() => setCurrentTab('personality')}
        >
          <Text>Personality</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.optionsContainer}>
        {currentTab === 'appearance' ? renderAppearanceOptions() : renderPersonalityOptions()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tab: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
  },
  activeTab: {
    backgroundColor: '#3E8E41',
  },
  optionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  textOption: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    marginRight: 10,
  },
});

export default CharacterCustomization;
