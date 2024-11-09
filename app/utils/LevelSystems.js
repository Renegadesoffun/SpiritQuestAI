import React from 'react';
import { View, Dimensions } from 'react-native';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');
const PLAYER_SIZE = 40;
const PLATFORM_HEIGHT = 20;
const COLLECTIBLE_SIZE = 20;

// Import individual game systems
import { FlappyBirdSystem } from '../components/FlappyBirdGame';
import { VerticalPlatformerSystem } from '../components/VerticalPlatformerGame';
import { UnderwaterSystem } from './UnderwaterGame';
import { EndlessRunnerSystem } from './EndlessRunnerGame';
import { PuzzleSystem } from './PuzzleGame';
import { RhythmSystem } from './RhythmGame';
import { StealthSystem } from './StealthGame';
import { ResourceManagementSystem } from './ResourceManagementGame';
import { BossBattleSystem } from '../components/BossBattleGame';

// Helper functions
const checkCollision = (entity1, entity2) => {
  return (entity1.position.x < entity2.position.x + entity2.size &&
          entity1.position.x + entity1.size > entity2.position.x &&
          entity1.position.y < entity2.position.y + entity2.size &&
          entity1.position.y + entity1.size > entity2.position.y);
};

export { 
  FlappyBirdSystem, 
  VerticalPlatformerSystem, 
  UnderwaterSystem, 
  EndlessRunnerSystem,
  PuzzleSystem,
  RhythmSystem,
  StealthSystem,
  ResourceManagementSystem,
  BossBattleSystem,
  checkCollision
};
