//importing modules
const mongoose = require('mongoose')
const chalk = require("chalk");

//Mongoose config to connect to the db
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true 
})

const db = mongoose.connection;

db.on("error", () => {
  console.log(chalk.red("[ERROR]: ") + "Mongoose / Database Connection Error");
});
db.once("open", () => {
  console.log(chalk.green("[INIT]: ") + "Mongoose Connected Successfully");
});