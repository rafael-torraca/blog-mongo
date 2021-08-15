const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Usuario");
const Usuario = mongoose.model("usuarios");
const bcrypt = require("bcryptjs");
const passport = require("passport");

router.get("/registro", (req, res) => {
  res.render("usuario/registro");
});

router.post("/registro", (req, res) => {
  var erros = [];

  if (
    !req.body.nome ||
    typeof req.body.nome == undefined ||
    req.body.nome == null
  ) {
    erros.push({ texto: "Nome inválido!" });
  }

  if (
    !req.body.email ||
    typeof req.body.email == undefined ||
    req.body.email == null
  ) {
    erros.push({ texto: "email inválido!" });
  }

  if (
    !req.body.senha ||
    typeof req.body.senha == undefined ||
    req.body.senha == null
  ) {
    erros.push({ texto: "Senha inválida!" });
  }

  if (req.body.senha.length < 3) {
    erros.push({ texto: "Senha muito curta!" });
  }

  if (req.body.senha != req.body.senha2) {
    erros.push({ texto: "Senhas diferentes!" });
  }

  if (erros.length > 0) {
    res.render("usuario/registro", { texto: erros });
  } else {
    (async () => {
      try {
        const userExist = await Usuario.findOne({ email: req.body.email });
        if (userExist) {
          req.flash("error_msg", "O email já existe!");
          res.redirect("/usuario/registro");
        } else {
          const newUser = new Usuario({
            nome: req.body.nome,
            email: req.body.email,
            senha: req.body.senha
          });

          bcrypt.genSalt(10, (erro, salt) => {
            bcrypt.hash(newUser.senha, salt, (erro, hash) => {
              if (erro) {
                req.flash("error_msg", "Erro durante hash senha!");
                res.redirect("/");
              }
              newUser.senha = hash;
              newUser.save();
              req.flash("success_msg", "Usuario criado!");
              res.redirect("/");
            })
          })
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }
});

router.get("/login", (req, res) => {
  res.render("usuario/login");
});


router.post("/login", (req, res, next) => {

  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/usuario/login",
    failureFlash: true
  })(req, res, next)
})


router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "Deslogado com sucesso!!");
  res.redirect("/");
})

// Usuario.findOne({ email: req.body.email })
//   .then((user) => {
//     if (user) {
//       req.flash("error_msg", "O email já existe!");
//       res.redirect("/usuario/registro");
//     } else {
//       const newUser = new Usuario({
//         nome: req.body.nome,
//         email: req.body.email,
//         senha: req.body.senha,
//       });

//       bcrypt.genSalt(10, (error, salt) => {
//         bcrypt.hash(newUser.senha, salt, (error, hash) => {
//           if (error) {
//             req.flash("error_msg", "Erro durante hash senha!");
//             res.redirect("/");
//           }
//           newUser.senha = hash;
//           newUser
//             .save()
//             .then(() => {
//               req.flash("success_msg", "Usuário criado com sucesso!");
//               res.redirect("/");
//             })
//             .catch((error) => {
//               console.log(error);
//               req.flash(
//                 "error_msg",
//                 "Erro ao criar usuário. Tente novamente!"
//               );
//               res.redirect("/usuario/registro");
//             });
//         });
//       });
//     }
//   })
//   .catch((error) => {
//     console.log(error);
//     req.flash("error_msg", "Houve um erro interno!");
//     res.redirect("/");
//   });


module.exports = router;
