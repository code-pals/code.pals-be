const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// Built in middleware

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:7891',
    exposedHeaders: ['set-cookie'],
  })
);
app.use(express.json());
app.use(cookieParser());

// App routes
app.use('/api/v1/users', require('./controllers/users'));
app.use('/api/v1/posts', require('./controllers/posts'));
app.use('/api/v1/boards', require('./controllers/boards'));
app.use('/api/v1/comments', require('./controllers/comments'));
// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
