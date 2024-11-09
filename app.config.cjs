// app.config.cjs
module.exports = {
  name: 'SpiritQuest',
  slug: 'spirit-quest',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './app/assets/images/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './app/assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#1c092c'
  },
  plugins: [
    "expo-av"
  ],
  assetBundlePatterns: [
    "app/assets/**/*"
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.renegadesoffun.spiritquest",
    infoPlist: {
      UIBackgroundModes: [
        "audio"
      ],
      NSMicrophoneUsageDescription: false
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './app/assets/images/adaptive-icon.png',
      backgroundColor: '#1c092c'
    },
    package: "com.renegadesoffun.spiritquest",
    permissions: [
      "MODIFY_AUDIO_SETTINGS"
    ]
  },
  web: {
    favicon: './app/assets/images/favicon.png'
  },
  extra: {
    eas: {
      projectId: "your-project-id"
    }
  }
};