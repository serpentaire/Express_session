require("dotenv").config();
const { hashPassword, verifyPassword, verifyToken } = require("./auth.js");
const Session = require('express-session');
const FileStore = require('session-file-store')(Session);
const express = require("express");

const app = express();

app.use(express.json());
app.use(Session({
  store: new FileStore({
      path: "D:/ecole_DEV/express/express_session/express_session/tmp",
      encrypt: true
  }),
  secret: 'Super Secret !',
  resave: true,
  saveUninitialized: true,
  name : 'sessionId'
}));

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const userHandlers = require("./userHandlers");

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.post(
  "/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);
app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);

app.post("/api/users", hashPassword, userHandlers.postUser);

app.get("/api/session-in",(req, res) => {
  req.session.song = 'be bop a lula';
  res.sendStatus(204);
});
app.get("/api/session-out",(req, res) => {
  res.end(req.session.song);
});

app.use(verifyToken);
app.post("/api/movies", movieHandlers.postMovie);
app.put("/api/movies/:id", movieHandlers.updateMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);

app.put("/api/users/:id", userHandlers.updateUser);
app.delete("/api/users/:id", userHandlers.deleteUser);



app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
