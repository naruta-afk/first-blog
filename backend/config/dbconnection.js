const mongoose = require("mongoose");

module.exports = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected");
    } catch (error) {
        console.log("Connection error",error);
    }
};