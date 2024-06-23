const { EnvironmentPlugin } = require('webpack');

require('dotenv').config();

module.exports = {
  output: {
    crossOriginLoading: 'anonymous'
  },
  plugins: [
    new EnvironmentPlugin([
      'FIREBASE_API_KEY',
      'FIREBASE_AUTH_DOMAIN',
      'FIREBASE_PROJECT_ID',
      'FIREBASE_STORAGE_BUCKET',
      'FIREBASE_MESSAGING_SENDER_ID',
      'FIREBASE_APP_ID',
      'FIREBASE_MEASUREMENT_ID'
    ])
  ]
}