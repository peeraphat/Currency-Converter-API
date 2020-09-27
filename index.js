const functions = require('firebase-functions');
const app = require('./src/main')

exports.conversion = functions.https.onRequest(app)
