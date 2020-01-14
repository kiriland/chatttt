let express = require("express");
let authentication = require("./controllers/authController");
let chat = require("./controllers/chatController");

let app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
authentication(app);

const server = app.listen(20201);

chat(app, server);
