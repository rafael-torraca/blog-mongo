const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Model do usuario
require("../models/Usuario");
const Usuario = mongoose.model("usuarios");

module.exports = (passport) => {
  passport.use(
    new localStrategy(
      { usernameField: "email", passwordField: "senha" },
      (email, senha, done) => {
        Usuario.findOne({ email: email }).then((usuario) => {
          if (!usuario) {
            return done(null, false, { message: "Esta conta não existe!" });
          }

          bcrypt.compare(senha, usuario.senha, (erro, batem) => {
            if (batem) {
              return done(null, usuario);
            } else {
              return done(null, false, { message: "Senha incorreta!" });
            }
          });
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    await Usuario.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
