require('dotenv').config();
const express = require('express');
const port = process.env.PORT || 3000;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('*', (req, res) => {
  res.send(`TADA! Backend stuff and things! Running on ${process.env.HOST}<br>
    BUILD_DIR: ${process.env.BUILD_DIR}<br>
    CACHE_DIR: ${process.env.CACHE_DIR}<br>
    PROJECT_PATH: ${process.env.PROJECT_PATH}`);
});

app.listen(port, () => {
  console.log(`Application running at http://localhost:${port}`);
});