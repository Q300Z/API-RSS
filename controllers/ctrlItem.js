//const axios = require('axios')
//const parser = require('xml2json');

const itemRss = require('../db/models/modelItem.js');

exports.getArticle = async (req, res, next) => {
    try {
        //code pour récupérer tous les articles
        const id = parseInt(req.params.id)
        await res.status(200).send(`Récupere les articles de l'id : ${id}`)
    } catch (error) {
        console.error(error);
        await res.status(500).send('Erreur serveur')
    }
}

exports.modifyArticles = async (req, res, next) => {
    try {
        //code pour modifier un article
        const id = parseInt(req.params.id)
        const idArticle = parseInt(req.params.idArticle)
        await res.status(200).send(`Mise à jour de l'article ${idArticle} du flux ${id}`)
    } catch (error) {
        console.error(error);
        await res.status(500).send('Erreur serveur')
    }
}