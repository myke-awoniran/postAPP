const fs = require('fs');
const https = require('https');
const Mongoose = require('mongoose');
const dotenv = require('dotenv').config({ path: './config.env' });
const app = require('./app');

const port = process.env.PORT;

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

Mongoose.connection.once('open', () => {
  console.log('Mongo DB connected successfully');
});

Mongoose.connection.on('error', (err) => {
  console.log(err.message);
});

const DbConnection = async (db) => {
  await Mongoose.connect(db);
};
DbConnection(DB);

https
  .createServer(
    {
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem'),
    },
    app
  )
  .listen(port || 8080, () => {
    console.log(`App running on localhost:${port}`);
  });
