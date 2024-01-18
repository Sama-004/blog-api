require("dotenv").config();
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express()
app.use(bodyParser.json());

const PORT = 3000

// Set up mongoose connection
const mongoDB = process.env.MONGODB_URL;
mongoose.connect(mongoDB);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})