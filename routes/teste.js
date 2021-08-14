const express = require('express');
const router = express.Router();


router.get("/", (req, res) => {
  res.send("Pagina principal teste");
});

router.get("/posts", (req, res) => {
  res.send("Pagina de posts teste");
});

router.get("/categorias", (req, res) => {
  res.send("catigoria teste");
})


module.exports = router;