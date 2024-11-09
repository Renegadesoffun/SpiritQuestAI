import i18n from 'i18n-js';
import * as Localization from 'expo-localization';

i18n.translations = {
  en: { welcome: 'Welcome to Spirit Quest' },
  es: { welcome: 'Bienvenido a Spirit Quest' },
  // ... more translations ...
};

i18n.locale = Localization.locale;
i18n.fallbacks = true;

export default i18n;
