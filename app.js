const express = require("express");
const handlebars = require("express-handlebars");
const app = express();
const admin = require("./routes/admin");
const usuario = require("./routes/usuario");
// const teste = require("./routes/teste");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
require("./models/Postagem");
const Postagem = mongoose.model("postagens");
require("./models/Categoria");
const Categoria = mongoose.model("categorias");
const passport = require("passport");
require("./config/auth")(passport);
const db = require("./config/db");

// Config
// Sessao
app.use(
  session({
    secret: "cursodenode",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Middleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// Express Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Public
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  console.log("Oi eu sou um middleware :)");
  next();
});

// Handlebars
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Mongoose
mongoose.Promise = global.Promise;
mongoose
  .connect(db.mongoURI)
  .then(() => {
    console.log("Conectado ao mongo!");
  })
  .catch((error) => {
    console.log("Erro ao se conectar: " + error);
  });

// Routes
app.get("/", (req, res) => {
  Postagem.find()
    .populate("categoria")
    .sort({ data: "desc" })
    .then((postagens) => {
      res.render("index", {
        postagens: postagens.map((postagem) => postagem.toJSON()),
      });
    })
    .catch((erro) => {
      req.flash("error_msg", "Houve um erro interno!");
      res.render("/404");
    });
});

app.get("/postagem/:slug", (req, res) => {
  Postagem.findOne({ slug: req.params.slug })
    .lean()
    .then((postagem) => {
      if (postagem) {
        res.render("postagem/index", {
          postagem: postagem
        });
      } else {
        req.flash("error_msg", "Esta postagem não existe!");
        res.redirect("/");
      }
    })
    .catch((erro) => {
      req.flash("error_msg", "Esta postagem não existe!");
      res.redirect("/");
    });
});

app.get("/categorias", (req, res) => {
  Categoria.find()
    .lean()
    .then((categorias) => {
      res.render("categorias/index", {categorias: categorias})
    })
    .catch((erro) => {
      req.flash("error_msg", "Houve um erro ao listar as categorias!");
      res.redirect("/");
    })

})

// app.get("/categorias/:slug", (req, res) => {
//   Categoria.findOne({ slug: req.params.slug })
//     .then((categoria) => {
//       if (categoria) {
//         Postagem.find({ categoria: categoria._id })
//           .then((postagens) => {
//             res.render("categorias/postagens", { categoria: categoria, postagens: postagens.map(postagem => postagem.toJSON())})
//           })
//           .catch(() => {
//             req.flash("error_msg", "Houve um erro ao listar os posts!");
//             res.redirect("/");
//           })
//       } else {
//         req.flash("error_msg", "Esta categoria não existe!");
//         res.redirect("/");
//       }
//     })
//     .catch((erro) => {
//       req.flash("error_msg", "Houve um erro ao carregar a página desta categoria!");
//       res.redirect("/");
//     })
// })


// app.get("/categorias/:slug", (req, res) => {
//   async function renderPosts() {
//     try {
//       const categoria = await Categoria.findOne({ slug: req.params.slug });
//       if (categoria) {
//         const postagens = await Postagem.find({ categoria: categoria._id });
//         res.render("categorias/postagens", { categoria: categoria, postagens: postagens.map(postagem => postagem.toJSON()) });
//       }
//     } catch (err) {
//       req.flash("error_msg", "Houve um erro ao listar os posts!");
//       res.redirect("/");
//     }
//   }
//   renderPosts();
// });

// aprendendo que o then/catch eh mei ruim
app.get("/categorias/:slug", (req, res) => {
  (async () => {
    try {
      const categoria = await Categoria.findOne({ slug: req.params.slug });
      if (categoria) {
        const postagens = await Postagem.find({ categoria: categoria._id });
        res.render("categorias/postagens", { categoria: categoria, postagens: postagens.map(postagem => postagem.toJSON()) });
      }
    } catch (err) {
      req.flash("error_msg", "Houve um erro ao listar os posts!");
      res.redirect("/");
    }
  })()
});



app.get("/404", (req, res) => {
  res.send("Erro 404!");
});

app.use("/admin", admin);
app.use("/usuario", usuario);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando em: ");
  console.log("http://localhost:3000");
});
