import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';

dotenv.config({
    path: './env'
})


connectDB()
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            console.log("SERVER is listening on port " + process.env.PORT);
        })
        app.on('error', () => {
            console.log("ERROR: ", error);
            throw error
        })
    })
    .catch((error) => {
        console.log("MONGO DB CONNECTION FAILED !! ", error);
    })