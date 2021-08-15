const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Categoria");
const Categoria = mongoose.model("categorias");
require("../models/Postagem");
const Postagem = mongoose.model("postagens");

router.get("/", (req, res) => {
  res.render("admin/index");
});

router.get("/posts", (req, res) => {
  res.send("Pagina de posts");
});

router.get("/categorias", (req, res) => {
  Categoria.find()
    .sort({ date: "desc" })
    .then((categorias) => {
      // find vai listar todas as categorias q existem
      res.render("./admin/categorias", {
        categorias: categorias.map((Categoria) => Categoria.toJSON()),
      });
    })
    .catch((error) => {
      console.log("houve um erro ao listar as categorias " + erro);
      res.redirect("/admin");
    });
});

router.get("/categorias/add", (req, res) => {
  res.render("admin/addcategorias");
});

router.post("/categorias/nova", (req, res) => {
  const erros = [];
  if (
    !req.body.nome ||
    typeof req.body.nome === undefined ||
    req.body.nome === null
  ) {
    erros.push({ texto: "Nome inválido!" });
  }
  if (
    !req.body.slug ||
    typeof req.body.slug === undefined ||
    req.body.slug === null
  ) {
    erros.push({ texto: "Slug inválido!" });
  }
  if (req.body.nome.length < 2) {
    erros.push({ texto: "Nome da categoria é muito pequeno!" });
  }
  if (req.body.slug.length < 2) {
    erros.push({ texto: "Nome da slug é muito pequeno!" });
  }
  if (erros.length > 0) {
    res.render("admin/addcategorias", { erros: erros });
  } else {
    const novaCategoria = {
      nome: req.body.nome,
      slug: req.body.slug,
    };
    new Categoria(novaCategoria)
      .save()
      .then(() => {
        req.flash("success_msg", "Categoria criada com sucesso!");
        res.redirect("/admin/categorias");
      })
      .catch((erro) => {
        req.flash(
          "error_msg",
          "Houve um erro ao salvar a categoria, tente novamente!"
        );
      });
  }
});

router.get("/categorias/edit/:id", (req, res) => {
  Categoria.findOne({ _id: req.params.id })
    .lean()
    .then((categoria) => {
      res.render("admin/editcategorias", { categoria: categoria });
    })
    .catch((erro) => {
      req.flash("error_msg", "Esta categoria não existe!");
      res.redirect("/admin/categorias");
    });
});

router.post("/categorias/edit", (req, res) => {
  const erros = [];
  if (
    !req.body.nome ||
    typeof req.body.nome === undefined ||
    req.body.nome === null
  ) {
    erros.push({ texto: "Nome inválido!" });
  }
  if (
    !req.body.slug ||
    typeof req.body.slug === undefined ||
    req.body.slug === null
  ) {
    erros.push({ texto: "Slug inválido!" });
  }
  if (req.body.nome.length < 2) {
    erros.push({ texto: "Nome da categoria é muito pequeno!" });
  }
  if (erros.length > 0) {
    res.render("admin/addcategorias", { erros: erros });
  } else {
    Categoria.findOne({ _id: req.body.id })
      .then((categoria) => {
        categoria.nome = req.body.nome;
        categoria.slug = req.body.slug;

        categoria
          .save()
          .then(() => {
            req.flash("success_msg", "Categoria editada com sucesso!");
            res.redirect("/admin/categorias");
          })
          .catch((erro) => {
            req.flash("error_msg", "Houve um erro ao salvar a categoria!");
            res.redirect("/admin/categorias");
          });
      })
      .catch((erro) => {
        req.flash("error_msg", "Houve um erro ao editar a categoria!");
        res.redirect("/admin/categorias");
      });
  }
});

router.post("/categorias/del", (req, res) => {
  Categoria.remove({ _id: req.body.id })
    .then(() => {
      req.flash("success_msg", "Categoria deletada com sucesso!");
      res.redirect("/admin/categorias");
    })
    .catch((erro) => {
      req.flash("error_msg", "Houve um erro ao deletar a categoria!");
      res.redirect("/admin/categorias");
    });
});

router.get("/postagens", (req, res) => {
  Postagem.find()
    .populate("categoria")
    .sort({ data: "desc" })
    .then((postagens) => {
      res.render("admin/postagens", {
        postagens: postagens.map((postagem) => postagem.toJSON()),
      });
    })
    .catch((erro) => {
      req.flash("error_msg", "Houve um erro ao listar as postagens!");
      res.redirect("/admin/postagens");
    });
});

router.get("/postagens/add", (req, res) => {
  Categoria.find()
    .lean()
    .then((categorias) => {
      res.render("admin/addpostagem", { categorias: categorias });
    })
    .catch((erro) => {
      req.flash("error_msg", "Houve um erro ao carregar o formulário!");
      req.redirect("/admin");
    });
});

router.post("/postagens/nova", (req, res) => {
  const erros = [];
  if (
    !req.body.titulo ||
    typeof req.body.titulo === undefined ||
    req.body.titulo === null
  ) {
    erros.push({ texto: "Nome inválido!" });
  }
  if (
    !req.body.slug ||
    typeof req.body.slug === undefined ||
    req.body.slug === null
  ) {
    erros.push({ texto: "Slug inválido!" });
  }
  if (
    !req.body.descricao ||
    typeof req.body.descricao === undefined ||
    req.body.descricao === null
  ) {
    erros.push({ texto: "Descricao inválida!" });
  }
  if (
    !req.body.conteudo ||
    typeof req.body.conteudo === undefined ||
    req.body.conteudo === null
  ) {
    erros.push({ texto: "Conteúdo inválido!" });
  }
  if (req.body.titulo.length < 2) {
    erros.push({ texto: "Titulo da postagem é muito pequeno!" });
  }
  if (req.body.categoria === "0") {
    erros.push({ texto: "Categoria inválida, registre uma categoria!" });
  }
  if (erros.length > 0) {
    res.render("admin/addpostagem", { erros: erros });
  } else {
    const novaPostagem = {
      titulo: req.body.titulo,
      slug: req.body.slug,
      descricao: req.body.descricao,
      conteudo: req.body.conteudo,
      categoria: req.body.categoria,
    };

    new Postagem(novaPostagem)
      .save()
      .then(() => {
        req.flash("success_msg", "Postagem criada com sucesso!");
        res.redirect("/admin/postagens");
      })
      .catch((erro) => {
        req.flash(
          "error_msg",
          "Houve um erro durante o salvamento da postagem!"
        );
        res.redirect("/admin/postagens");
      });
  }
});

router.get("/postagens/edit/:id", (req, res) => {
  // Postagem.findOne({ _id: req.params.id })
  Postagem.findById(req.params.id)
    .lean()
    .then((postagem) => {
      Categoria.find()
        .lean()
        .populate("categoria")
        .then((categorias) => {
          res.render("admin/editpostagens", {
            categorias: categorias,
            postagem: postagem,
          });
        })
        .catch((erro) => {
          req.flash("error_msg", "Houve um erro ao listar as categorias!");
          res.redirect("/admin/postagens");
        });
    })
    .catch((erro) => {
      req.flash(
        "error_msg",
        "Houve um erro ao carregar o formulário de edição!"
      );
      res.redirect("/admin/postagens");
    });
});

router.post("/postagem/edit", (req, res) => {
  Postagem.findById(req.body.id)
    .then((postagem) => {
      postagem.titulo = req.body.titulo;
      postagem.slug = req.body.slug;
      postagem.descricao = req.body.descricao;
      postagem.conteudo = req.body.conteudo;
      postagem.categoria = req.body.categoria;
      postagem.data = new Date();

      postagem
        .save()
        .then(() => {
          req.flash("success_msg", "Postagem editada com sucesso!");
          res.redirect("/admin/postagens");
        })
        .catch((erro) => {
          console.log("Erro aqui: " + erro);
          req.flash("error_msg", "Erro na edição da postagem!");
          res.redirect("/admin/postagens");
        });
    })
    .catch((erro) => {
      console.log("Erro aqui: " + erro);
      req.flash("error_msg", "Houve um erro ao salvar a edição!");
      res.redirect("/admin/postagens");
    });
});

router.post("/postagens/del", (req, res) => {
  Postagem.remove({ _id: req.body.id })
    .then(() => {
      req.flash("success_msg", "Postagem deletada com sucesso!");
      res.redirect("/admin/postagens");
    })
    .catch((erro) => {
      req.flash("error_msg", "Houve um erro ao deletar a categoria!");
      res.redirect("/admin/postagens");
    });
});


module.exports = router;
