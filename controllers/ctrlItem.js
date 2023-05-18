const { ObjectId } = require("mongodb");
const ItemRss = require("../db/models/modelItem.js");

exports.getArticle = async (req, res, next) => {
  try {
    //code pour récupérer tous les articles
    const id = req.params.id;

    ItemRss.find({ source: id })
      .then((el) => {
        res.status(200).json(el);
      })
      .catch((er) => {
        res.status(500).json({ "Erreur serveur ": er });
      });
    // await res.status(200).send(`Récupere les articles de l'id : ${id}`)
  } catch (error) {
    console.error(error);
    await res.status(500).json({ "Erreur serveur ": error });
  }
};

exports.modifyArticles = async (req, res, next) => {
  try {
    //code pour modifier un article
    const id = new ObjectId(req.params.id);
    const idArticle = new ObjectId(req.params.idArticle);
    console.log(`Mise à jour de l'article ${idArticle} du flux ${id}`);

    const update = {
      $set: {
        ...req.body, // New value for the 'age' field
      },
    };

    await ItemRss.updateOne({ _id: idArticle }, update).then(() => {
      let article = "";
      ItemRss.find({ _id: idArticle }).then((el) => {
        article = el;
        res.status(200).json({
          message: `Mise à jour de l'article ${idArticle} du flux ${id}`,
          data: article,
        });
      });
    });
  } catch (error) {
    console.error(error);
    await res.status(500).json({
      message: "Error server",
      data: error,
    });
  }
};
