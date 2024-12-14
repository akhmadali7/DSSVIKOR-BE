import express from "express";
import dotenv from "dotenv";

//Import Routes
// const authRoutes = require('./routes/auth');
import alternativesRoutes from "./routes/alternativesRoute.js";
import criteriaRoutes from "./routes/criteriaRoute.js";
// import accountsRoutes from "./routes/accounts";
import scoreVRoutes from "./routes/scoreVRoute.js";
import scoreRoutes from "./routes/scoreRoute.js";
import vikorRoutes from "./routes/vikorRoutes.js";

import {log} from "./middleware/log.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(log)


app.listen(process.env.PORT || 4001 || 4545, () => {
    console.log("Listening on port " + process.env.PORT);
})

//Middleware


//Main Routes
app.use('/alternatives', alternativesRoutes)
app.use('/criteria', criteriaRoutes)
app.use('/scores', scoreRoutes)
app.use('/score_v', scoreVRoutes)
app.use('/vikor', vikorRoutes)
// app.use('/accounts', accountsRoutes)
