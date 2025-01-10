const express = require('express');
const dbconnect = require('./config/dbconnection');
require("dotenv").config();
//database connection
dbconnect();

const app = express();

//Middlewares
app.use(express.json());

//Routes
app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/users', require('./routes/usersRoute'));

//running the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));