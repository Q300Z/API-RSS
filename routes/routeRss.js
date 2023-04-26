const express = require("express");
const router = express.Router();

const fluxCtrl = require("../controllers/ctrlFlux.js");
const itemCtrl = require("../controllers/ctrlItem.js");

router.get("/", fluxCtrl.getAllFlux); //GET /flux : recupere la liste des flux rss
router.post("/", fluxCtrl.createFlux); //POST /flux : ajout flus rss
router.put("/:id", fluxCtrl.modifyFlux); //PUT /flux/:id : mise à jour d'un flux rss
router.delete("/:id", fluxCtrl.deleteFlux); //DELETE /flux/:id : suppression d'un flux rss
router.get("/update", fluxCtrl.updateAllFlux); //GET /flux : met à jour  tous les flux rss
router.get("/update/:id", fluxCtrl.updateFlux); //GET /flux : met à jour  un flux rss

router.get("/articles/:id", itemCtrl.getArticle); //GET /flux/articles/:id : recupere les articles d'un flux rss
router.put("/articles/:id/:idArticle", itemCtrl.modifyArticles); //PUT /flux/articles/:id/:idArticle : modifie l'etat d'un article

module.exports = router;
