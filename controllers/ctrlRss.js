//const axios = require('axios')
//const parser = require('xml2json');

const fluxRss = require('../db/models/modelRss.js');

exports.getAllFlux = async (req, res, next) => {
    try {
        // code pour récupérer tous les flux RSS
        await res.status(200).send('Liste tous les flux RSS disponible')
    } catch (error) {
        console.error(error);
        await res.status(500).send('Erreur serveur')
    }
}

exports.createFlux = async (req, res, next) => {
    try {
        // code pour ajouter un flux RSS
        await res.status(200).send(`Ajout de : ${req.body}`)
    } catch (error) {
        console.error(error);
        await res.status(500).send('Erreur serveur')
    }
}

exports.modifyFlux = async (req, res, next) => {
    try {
        //code pour modifier un flux RSS
        const id = parseInt(req.params.id)
        await res.status(200).send(`Mise à jour de l'id : ${id}`)
    } catch (error) {
        console.error(error);
        await res.status(500).send('Erreur serveur')
    }
}

exports.deleteFlux = async (req, res, next) => {
    try {
        //code pour supprimer un flux RSS
        const id = parseInt(req.params.id)
        await res.status(200).send(`Suppression de l'id : ${id}`)
    } catch (error) {
        console.error(error);
        await res.status(500).send('Erreur serveur')
    }
}

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