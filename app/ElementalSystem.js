const elements = ['fire', 'water', 'air', 'earth', 'aether'];

export class ElementalAttunement {
  constructor() {
    this.attunements = elements.reduce((acc, elem) => ({ ...acc, [elem]: 0 }), {});
  }

  attune(element, amount) {
    if (this.attunements.hasOwnProperty(element)) {
      this.attunements[element] = Math.min(this.attunements[element] + amount, 100);
    }
  }

  getAbilities() {
    return Object.entries(this.attunements).reduce((acc, [element, level]) => {
      if (level >= 50) acc.push(`${element.charAt(0).toUpperCase() + element.slice(1)} Mastery`);
      return acc;
    }, []);
  }
}
