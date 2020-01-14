module.exports = function (app) {
    var bodyParser = require("body-parser");
    var jsonParser = bodyParser.json();
    var firebase = require("firebase/app");
    require("firebase/auth");
    require("firebase/firestore");
    // create application/x-www-form-urlencoded parser
    var urlencodedParser = bodyParser.urlencoded({
        extended: false
    });
    var firebaseConfig = {
        apiKey: "AIzaSyBqdoai-6fYJAsX7_dGNlkuAgqwfo-JzsY",
        authDomain: "chatter-46991.firebaseapp.com",
        databaseURL: "https://chatter-46991.firebaseio.com",
        projectId: "chatter-46991",
        storageBucket: "chatter-46991.appspot.com",
        messagingSenderId: "237985571954",
        appId: "1:237985571954:web:f6e45cc0673245cc1c0eeb"
    };
    currUser = null;
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    db = firebase.firestore();
    auth.onAuthStateChanged(function (user) {
        if (user) {
            currUser = user;
        }
    });
    app.post("/signup", urlencodedParser, function (req, res) {
        auth.createUserWithEmailAndPassword(
                req.body.email,
                req.body.password
            ).then(cred => {
                return db.collection("users").doc(cred.user.uid).set({
                    nickname: "guest"
                });
            })
            .then(cred => {
                res.redirect("chat");
                res.json(cred);
            });
    });

    app.post("/signin", urlencodedParser, function (req, res) {
        auth.signInWithEmailAndPassword(req.body.email, req.body.password).then(
            cred => {
                res.send("done");
            }
        );
    });
    app.get("/", function (req, res) {
        if (currUser) {
            res.redirect("chat");
        } else {
            res.render("auth");
        }
    });
    app.post("/logout", urlencodedParser, function (req, res) {
        auth.signOut();
        currUser = null;
        res.redirect("/");
    });
};