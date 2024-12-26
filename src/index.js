import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import {log} from "./middleware/log.js";
import {adminVerification, authVerification} from "./utils/authVerification.js";

import alternativesRoutes from "./routes/alternativesRoute.js";
import criteriaRoutes from "./routes/criteriaRoute.js";
import authRoutes from "./routes/authRoute.js";
import scoreVRoutes from "./routes/scoreVRoute.js";
import scoreRoutes from "./routes/scoreRoute.js";
import vikorRoutes from "./routes/vikorRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";


const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors())


app.listen(process.env.PORT || 4001 || 4545, () => {
    console.log("Listening on port " + process.env.PORT);
})

//Middleware
app.use(log)

//Main Routes
app.use('/alternatives', authVerification, alternativesRoutes)
app.use('/criteria', authVerification, criteriaRoutes)
app.use('/scores', authVerification, scoreRoutes)
app.use('/score_v', authVerification, scoreVRoutes)
app.use('/vikor', authVerification, vikorRoutes)
app.use('/auth', authRoutes)
app.use('/admin', authVerification, adminVerification, adminRoutes)
