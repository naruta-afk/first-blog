const express = require('express');
const dbconnect = require('./config/dbconnection');
const {errorHandler, notFound} = require('./middlewares/error');
require("dotenv").config();
//database connection
dbconnect();

const app = express();

//Middlewares
app.use(express.json());

//Routes
app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/users', require('./routes/usersRoute'));
app.use('/api/posts', require('./routes/postRoute'));
app.use('/api/comments', require('./routes/commentRoute'));
app.use('/api/categories', require('./routes/categoryRoute'));

//error handler middleware
app.use(notFound);
app.use(errorHandler);


//running the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));