require('dotenv').config();
const express = require('express');
const port = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'dev';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('*', (req, res) => {
  res.send(
    `TADA! Backend stuff and things!<br><br>
    STUFF: ${process.env.STUFF}<br>
    NODE_ENV: ${NODE_ENV}<br>
    PROJECT_PATH: ${process.env.PROJECT_PATH}<br>
    PORT: ${port}`
  );
});

app.listen(port, () => {
  console.log(`Application running at http://localhost:${port}`);
});