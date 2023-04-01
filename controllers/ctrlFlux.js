//const axios = require('axios')
//const parser = require('xml2json');

const fluxRss = require('../db/models/modelFlux.js');

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

exports.updateAllFlux = async (req, res, next) => {
    try {
        // code pour mettre à jour  tous les flux rss
        await res.status(200).send('Met à jour  tous les flux rss')
    } catch (error) {
        console.error(error);
        await res.status(500).send('Erreur serveur')
    }
}

exports.updateFlux = async (req, res, next) => {
    try {
        // code pour mettre à jour un flux rss
        await res.status(200).send('Met à jour  un flux rss')
    } catch (error) {
        console.error(error);
        await res.status(500).send('Erreur serveur')
    }
}
