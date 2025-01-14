import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './router/index.js';
import { connectDB } from './connectDB/index.js';
import cookieParser from 'cookie-parser';
import { frontendUrl } from './constants/index.js';
const app = express();

dotenv.config();

app.use(cors(
    {
        origin: frontendUrl,
        credentials: true
    }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());


app.use('/api', router);


app.listen(process.env.PORT || 3001, () => {
    connectDB()
    .then(
        () => {
            console.log('Server started on port 3001');
        }
    )
    .catch(
        (error) => {
            console.log('Database connection failed');
            console.log(error);
        }
    )
});
