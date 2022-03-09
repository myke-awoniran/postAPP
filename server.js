const app = require('./app');
const Mongoose = require('mongoose');
const dotenv = require('dotenv').config({ path: './config.env' });

const port = process.env.PORT;

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

async function DbConnection(db) {
  await Mongoose.connect(db).then((res) => {
    console.log('Database connected successfully');
  });
}

async function startServer() {
  await DbConnection(DB);
  app.listen(port || 8080, () => {
    console.log(`App running on localhost:${port}`);
  });
}

startServer();
