const socket = require("socket.io");
module.exports = function (app, server) {
    let channels = [];
    let connections = 0;
    let io = socket(server, {
        pingTimeout: 60000
    });
    let currentThread = null;
    let messages = [];
    let init = false;
    const getAllChannels = () => {
        if (!init) {
            db.collection("channels")
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        channels.push({
                            id: doc.id,
                            info: doc.data()
                        });
                    });

                    currentThread = channels[0].id;
                })
                .catch(err => {
                    console.log("Error getting documents", err);
                });
            init = true;

        }
    }
    let getMessages = id => {
        let thing = "temp"; //DB error workaround
        if (id) {
            thing = id;
        }
        db.collection("channels").doc(thing).collection("thread").get().then(snapshot => {
            snapshot.forEach(doc => {
                messages.push({
                    id: doc.id,
                    data: doc.data()
                });
                console.log(messages);
            });
        });

    };
    io.on("connection", function (socket) {
        connections++;

        io.sockets.emit("totalConnections", connections);

        socket.on("disconnect", () => {
            connections--;
            io.sockets.emit("totalConnections", connections);
        });
        socket.on("sendMessage", function (msg) {
            io.sockets.emit("recieveMessage", {
                message: msg,
                email: currUser.email
            });
        });
    });
    app.get("/chat", function (req, res) {
        //getting all the channels avaliable
        getAllChannels();
        getMessages(currentThread);

        //    getMessages(currentThread);
        if (channels.length >= 1) { // waiting to populate the array
            if (currUser) {
                res.render("chat", {
                    channels: channels,
                    message: messages.data
                });

            } else {
                res.writeHead(403);
                res.end("not permitted");
            }
        }

    });
};