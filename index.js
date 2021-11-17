const express = require("express");
const mongoose = require("mongoose");
const redis = require('redis');
const session = require('express-session');
const cors = require("cors")

let RedisStore = require('connect-redis')(session);


const {
    MONGO_USER,
    MONGO_PASSWORD,
    MONGO_IP,
    MONGO_PORT,
    REDIS_URL,
    REDIS_PORT,
    SESSION_SECRET
} = require("./Config/config");


let redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT
});

const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

const connectWithRetry = () => {
    mongoose
        .connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`)
        .then(() => console.log("successfully connected to DB"))
        .catch((e) => {
            console.log(e);
            setTimeout(connectWithRetry, 5000);
        });
};

connectWithRetry();

app.enable("trust proxy");
app.use(cors({}));
app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: SESSION_SECRET,
        cookie: {
            secure: false,
            resave: false,
            saveUninitialized: false,
            httpOnly: true,
            maxAge: 40000
        }
        
    })
);

app.use(express.json());


app.get("/api/v1", (req, res) => {
    res.send("<h2>Hi There!!!</h2>");
    console.log("Hey there");
});

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));