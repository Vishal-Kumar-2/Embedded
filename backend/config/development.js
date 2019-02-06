module.exports = {
  port: process.env.PORT || 3000,
  loglevel: 'info',
  REDIS_CONFIG: 'redis://127.0.0.1:6379',
  firebase: {
    config: {
      apiKey: "API_KEY",
      authDomain: "",
      databaseURL: "",
      projectId: "credibleapp-website",
      storageBucket: "",
      messagingSenderId: ""
    },
    concurrencyLimit: 10
  }
};