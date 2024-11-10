const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const DB_NAME = "jobsdb";
const PORT = 4000;

const userRouter = require("./routes/user");
const jobRouter = require("./routes/job");
const appRouter = require("./routes/application");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({limit: '2mb'}));

// adding routes
app.use("/user", userRouter);
app.use("/job", jobRouter);
app.use("/application", appRouter);

// db connection
mongoose.connect(`mongodb+srv://bojjaganivivek5:manager@cluster0.jnpltaj.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});
mongoose.Promise = global.Promise;

const connection = mongoose.connection;
connection.once("open", function () {
    console.log("MongoDB database connection established successfully!");
});

app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});
