const express = require("express");
const handlebars = require("express-handlebars");
const app = express();
const admin = require("./routes/admin");
// const teste = require("./routes/teste");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");


// Config
// Sessao
app.use(session({
  secret: "cursodenode",
  resave: true,
  saveUninitialized: true
}));
app.use(flash());

// Middleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
})

// Express Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Public
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  console.log("Oi eu sou um middleware :)");
  next();
})

// Handlebars
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Mongoose
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/blogapp").then(() => {
  console.log("Conectado ao mongo!")
}).catch((error) => {
  console.log("Erro ao se conectar: " + error);
})

// Routes
// app.use("/", teste);
app.use("/admin", admin);


const PORT = 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando em: ")
  console.log("http://localhost:3000");
});