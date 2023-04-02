const axios = require("axios");
const parser = require("xml2json");
const mongodb = require("mongodb");

const FluxRss = require("../db/models/modelFlux.js");
const ItemRss = require("../db/models/modelItem.js");

exports.getAllFlux = async (req, res, next) => {
  try {
    // code pour récupérer tous les flux RSS
    FluxRss.find()
      .then((el) => {
        res.status(200).json(el);
      })
      .catch((er) => {
        res.status(500).send("Erreur serveur " + er);
      });
  } catch (error) {
    console.error(error);
  }
};

exports.createFlux = async (req, res, next) => {
  // code pour ajouter un flux RSS
  try {
    const find = await FluxRss.findOne({ link: req.body.link });
    if (find) {
      res.status(404).json({ message: "Flux existe déjà" });
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
    const source = { title: jsonFlux.rss.channel.title, link: req.body.link };
    //Enregistre le flux dans mongodb
    await saveFlux(jsonFlux, req.body.link);
    const articles = transformName(jsonFlux);
    const promises = []
    for (const i in articles) {
      promises.push(saveItems(articles[i], source));
    }
    await Promise.all(promises)

    res.status(201).json({ message: "Flux ajouté" });
  } catch (err) {
    res.status(500).send(err);
  }

  async function saveFlux(fluxJson, link) {
    // opérateur de déstructuration pour extraire directement les propriétés de l'objet fluxJson["rss"]["channel"] et les assigner aux propriétés correspondantes de l'objet flux. Thanks GPT
    const {
      title,
      description,
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
      title: title,
      description,
      link: link,
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
};
exports.modifyFlux = async (req, res, next) => {
  try {
    //code pour modifier un flux RSS
    FluxRss.updateOne(
      { _id: req.params.id },
      { ...req.body, _id: req.params.id }
    )
      .then(() => res.status(200).json({ message: "Flux modifié !" }))
      .catch((error) => res.status(500).json({ error }));
  } catch (error) {
    console.error(error);
    await res.status(500).send("Erreur serveur");
  }
};

exports.deleteFlux = async (req, res, next) => {
  //code pour supprimer un flux RSS
  try {
    const flux = await FluxRss.findById({ _id: req.params.id });
    if (flux !== null) {
      await FluxRss.deleteOne({ _id: req.params.id });
      await ItemRss.deleteMany({ "source.url": `${flux.link}` });
      res.status(200).json({ message: `Suppression du Flux : ${flux.title}` });
    } else {
      res.status(500).json({
        message: `Suppression du Flux impossible`,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: `Suppression du Flux : ${error}`,
    });
  }
};

exports.updateAllFlux = async (req, res, next) => {
  try {
    // code pour mettre à jour tous les flux rss
    const newArticles = [];
    const promises = [];
    const find = await FluxRss.find();
    if (!find) {
      res.status(404).json({ message: "Il n'y a pas Flux !" });
      return;
    }
    for (const element of find) {
      console.log(element.link);
      //Recupere le XML
      const response = await axios.get(element.link);
      //Transforme le flux rss xml en json
      const jsonFlux = parser.toJson(response.data, {
        object: true,
        alternateTextNode: true,
        sanitize: true,
        coerce: true,
      });
      //Renvoie les articles formaté
      const articles = transformName(jsonFlux);

      for (const newArticle of articles) {
        const oldArticle = await ItemRss.findOne({ title: newArticle.title });

        if (!oldArticle) {
          const source = { title: element.title, link: element.link };
          promises.push(saveItems(newArticle, source));
          newArticles.push(newArticle);
          console.log(newArticles.length)
        }
      };
      console.log(promises)
      await Promise.all(promises)
    };
    await res
      .status(200)
      .json({ message: "Met à jour  tous les flux rss", data: newArticles });
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

async function saveItems(items, source) {
  // opérateur de déstructuration pour extraire directement les propriétés de l'objet fluxJson["rss"]["channel"]["item"] et les assigner aux propriétés correspondantes de l'objet item. Thanks GPT
  const {
    title,
    description,
    link,
    pubDate,
    author,
    category,
    comments,
    enclosure,
  } = items;
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
      title: source.title,
      url: source.link,
    },
  });
  //Enregistre l'item dans mongodb
  await item.save();
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
