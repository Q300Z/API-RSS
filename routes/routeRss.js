const express = require('express')
const router = express.Router()


const rssCtrl = require('../controllers/ctrlRss.js')

router.get('/', rssCtrl.getAllFlux) //GET /flux : recupere la liste des flux rss
router.post('/', rssCtrl.createFlux) //POST /flux : ajout flus rss
router.put('/:id', rssCtrl.modifyFlux) //PUT /flux/:id : mise à jour d'un flux rss
router.delete('/:id', rssCtrl.deleteFlux) //DELETE /flux/:id : suppression d'un flux rss


router.get('/:id/articles', rssCtrl.getArticle) //GET /flux/:id/articles : recupere les articles d'un flux rss
router.put('/:id/articles/:idArticle', rssCtrl.modifyArticles) //PUT /flux/:id/articles/:idArticle : modifie l'etat d'un article

module.exports = router;