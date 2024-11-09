export const KarmaChoices = {
  COMPASSIONATE: 'compassionate',
  NEUTRAL: 'neutral',
  SELFISH: 'selfish'
};

export const karmaEvents = [
  {
    scenario: "You encounter a struggling spirit. Do you...",
    choices: [
      { text: "Help them", karma: KarmaChoices.COMPASSIONATE },
      { text: "Ignore them", karma: KarmaChoices.NEUTRAL },
      { text: "Take advantage of their weakness", karma: KarmaChoices.SELFISH }
    ]
  },
  // ... (add more karmic scenarios)
];

export function updateKarma(currentKarma, choice) {
  switch (choice) {
    case KarmaChoices.COMPASSIONATE:
      return Math.min(currentKarma + 10, 100);
    case KarmaChoices.NEUTRAL:
      return currentKarma;
    case KarmaChoices.SELFISH:
      return Math.max(currentKarma - 10, -100);
    default:
      return currentKarma;
  }
}
