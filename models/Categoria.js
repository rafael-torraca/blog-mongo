const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const Schema = require("mongoose").Schema;
// const mongoose, { Schema } = require("mongoose");

const Categoria = new Schema({
  nome: {
    type: String,
    require: true,
  },
  slug: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

mongoose.model("categorias", Categoria);
