const mongoose = require('mongoose');

const connectDB= async () => {
    try {
        console.log('----------------------------')
        console.log(process.env.MONGO_URI)
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${connect.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
} 

module.exports= connectDB