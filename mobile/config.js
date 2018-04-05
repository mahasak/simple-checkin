const config = {
  firebase: {
    apiKey: "<FIREBASE-API-KEY>",
    authDomain: "<FIREBASE-AUTH-DOMAIN>",
    databaseURL: "https://<FIREBASE-DATABASE-URL>",
    projectId: "<FIREBASE-APP-NAME>",
    storageBucket: "<FIREBASE-BUCKET>",
    messagingSenderId: "<FIREBASE-MESSAGE-ID>"
  },
  google: {
    androidStandaloneAppClientId: '<ANDROID_CLIENT_ID>', //No need
    iosStandaloneAppClientId: '<IOS_CLIENT_ID>', //No need
    androidClientId: '<ANDROID_CLIENT_ID>',
    iosClientId: '<IOS_CLIENT_ID>',
    scopes: ['profile', 'email']
  },
  eventId: '12345' // Data id in firebase
};

export default config;
