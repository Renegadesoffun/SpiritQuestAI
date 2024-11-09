export const AVAILABLE_SOUNDS = {
  instruments: {
    strings: {
      violin: {
        notes: ['A4', 'C4', 'D4', 'E4', 'G4'],
        articulations: ['pizzicato', 'sustain']
      },
      cello: {
        notes: ['C2', 'C3', 'G2'],
        articulations: ['pizzicato', 'sustain']
      },
      harp: {
        notes: ['C4', 'G4'],
        articulations: ['glissando', 'glissando_up', 'glissando_down']
      }
    },
    piano: {
      grand: {
        notes: ['C4', 'G4'],
        chords: ['Cmaj', 'Gmaj']
      },
      soft: {
        notes: ['C4', 'G4']
      }
    },
    choir: {
      sustain: ['ahh', 'mmm', 'ohh'],
      staccato: ['ahh']
    },
    pad: ['atmospheric', 'spirit']
  },
  ambient: {
    environments: ['crystal_cave', 'forest', 'meditation']
  },
  effects: {
    ui: ['achievement', 'magical_chime'],
    meditation: ['meditation_bell'],
    movement: ['spirit_whoosh']
  },
  music: {
    themes: ['boss', 'map']
  }
};

// Utility functions to check sound availability
export function isNoteAvailable(instrument, note) {
  const [category, type] = instrument.split('.');
  return AVAILABLE_SOUNDS.instruments[category]?.[type]?.notes?.includes(note) || false;
}

export function isArticulationAvailable(instrument, articulation) {
  const [category, type] = instrument.split('.');
  return AVAILABLE_SOUNDS.instruments[category]?.[type]?.articulations?.includes(articulation) || false;
}

export function isChordAvailable(instrument, chord) {
  const [category, type] = instrument.split('.');
  return AVAILABLE_SOUNDS.instruments[category]?.[type]?.chords?.includes(chord) || false;
} 