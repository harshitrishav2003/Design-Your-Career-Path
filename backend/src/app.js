import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// ✅ Serve resumes folder
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use('/resumes', express.static(path.join(__dirname, '../resumes')));


// app.use(cors({
//         origin: process.env.CORS_ORIGIN,
//         credentials: true
// }))
// Define the allowed origins
const allowedOrigins = ['http://localhost:5174'];
const corsOptions = {
        origin: function (origin, callback) {
                // Check if the origin is in the allowed list or not
                if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
                        callback(null, true);
                } else {
                        callback(new Error('Not allowed by CORS'));
                }
        },
        credentials: true // This allows the server to accept cookies
};

// Use the CORS middleware
app.use(cors(corsOptions));

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"));
app.use(cookieParser());

//routes
import userRouter from "./routes/user.routes.js";
import userResumeRouter from "./routes/userResume.routes.js";
import adminRouter from "./routes/admin.routes.js";

//routes declaration
app.use("/api/v1/users", userRouter, userResumeRouter)
app.use("/api/v1/admin", adminRouter)
export { app } 