require("../src/db/mongoose");
const app = require("./app");
const chalk = require("chalk");
require("dotenv").config({ override: true });

const port = process.env.PORT || 3000 ;

console.log(
  chalk.green("[INIT]:") + " Service is in " +
    chalk.yellow(process.env.MODE) +
    " MODE"
);

app.get("/*", (req, res) => {
  
    res.send("Hello")
});

app.listen(port, () => {
  console.log(
    chalk.green("[INIT]: ") + "Server Listening on PORT " + chalk.yellow(port)
  );
});