require('dotenv').config();

// connect to database
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI)
  .then(() => console.log(`Database connected successfully`))
  .catch(err => console.log(err));

const express = require('express')
const app = express();
const port = 8000;

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});