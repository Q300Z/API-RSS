const axios = require("axios");
const parser = require("xml2json");
const mongodb = require("mongodb");

const FluxRss = require("../db/models/modelFlux.js");
const ItemRss = require("../db/models/modelItem.js");

exports.getAllFlux = async (req, res, next) => {
  try {
    // code pour récupérer tous les flux RSS
    await res.status(200).send("Liste tous les flux RSS disponible");
  } catch (error) {
    console.error(error);
    await res.status(500).send("Erreur serveur");
  }
};

exports.createFlux = async (req, res, next) => {
  // code pour ajouter un flux RSS
  try {
    const find = await FluxRss.findOne({ link: req.body.link });
    if (find) {
      res.status(500).json({ message: "Flux existe déjà" });
      return;
    }
    //Récupére le flux rss xml
    const response = await axios.get(req.body.link);
    //Transforme le flux rss xml en json
    const jsonFlux = parser.toJson(response.data, {
      object: true,
      alternateTextNode: true,
      sanitize: true,
      coerce: true,
    });
    //Enregistre le flux dans mongodb
    await saveFlux(jsonFlux);
    await saveItems(transformName(jsonFlux), jsonFlux);
    res.status(201).json({ message: "Flux ajouté" });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }

  async function saveFlux(fluxJson) {
    // opérateur de déstructuration pour extraire directement les propriétés de l'objet fluxJson["rss"]["channel"] et les assigner aux propriétés correspondantes de l'objet flux. Thanks GPT
    const {
      title,
      description,
      link,
      pubDate,
      lastBuildDate,
      image,
      language,
      enclosure,
      copyright,
      managingEditor,
      webMaster,
      generator,
      docs,
      ttl,
      rating,
      textInput,
    } = fluxJson["rss"]["channel"];
    //Enregistre les informations du flux selon les modeles
    const flux = new FluxRss({
      title,
      description,
      link,
      pubDate,
      lastBuildDate,
      image,
      language,
      enclosure,
      copyright,
      managingEditor,
      webMaster,
      generator,
      docs,
      ttl,
      rating,
      textInput,
    });
    //Enregistre le flux dans mongodb
    await flux.save();
  }
  async function saveItems(items, fluxJson) {
    // opérateur de déstructuration pour extraire directement les propriétés de l'objet fluxJson["rss"]["channel"]["item"] et les assigner aux propriétés correspondantes de l'objet item. Thanks GPT
    for (it in items) {
      const {
        title,
        description,
        link,
        pubDate,
        author,
        category,
        comments,
        enclosure,
      } = items[it];

      //Enregistre les informations des items selon les modeles
      const item = new ItemRss({
        title,
        description,
        link,
        pubDate,
        author,
        category,
        comments,
        enclosure,
        source: {
          title: fluxJson["rss"]["channel"]["title"],
          url: fluxJson["rss"]["channel"]["link"],
        },
      });
      //Enregistre l'item dans mongodb
      await item.save();
    }
  }
  function transformName(fluxJson) {
    //Retire le "dc" des nom des valeurs de l'object
    var items = fluxJson["rss"]["channel"]["item"];
    for (let el in items) {
      for (let els in items[el]) {
        var parts = els.split(":");
        if (parts[0] == "dc") {
          items[el][parts[1]] = items[el][els];
          delete items[el][els];
        }
      }
    }
    return items;
  }
};
exports.modifyFlux = async (req, res, next) => {
  try {
    //code pour modifier un flux RSS
    const id = req.params.id;
    await res.status(200).send(`Mise à jour de l'id : ${id}`);
  } catch (error) {
    console.error(error);
    await res.status(500).send("Erreur serveur");
  }
};

exports.deleteFlux = async (req, res, next) => {
  try {
    //code pour supprimer un flux RSS
    const id = req.params.id;
    await res.status(200).send(`Suppression de l'id : ${id}`);
  } catch (error) {
    console.error(error);
    await res.status(500).send("Erreur serveur");
  }
};

exports.updateAllFlux = async (req, res, next) => {
  try {
    // code pour mettre à jour  tous les flux rss
    await res.status(200).send("Met à jour  tous les flux rss");
  } catch (error) {
    console.error(error);
    await res.status(500).send("Erreur serveur");
  }
};

exports.updateFlux = async (req, res, next) => {
  try {
    // code pour mettre à jour un flux rss
    await res.status(200).send("Met à jour  un flux rss");
  } catch (error) {
    console.error(error);
    await res.status(500).send("Erreur serveur");
  }
};
