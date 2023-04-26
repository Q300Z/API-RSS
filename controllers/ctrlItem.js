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
				res.status(500).send("Erreur serveur " + er);
			});
		// await res.status(200).send(`Récupere les articles de l'id : ${id}`)
	} catch (error) {
		console.error(error);
		await res.status(500).send("Erreur serveur");
	}
};

exports.modifyArticles = async (req, res, next) => {
	try {
		//code pour modifier un article
		const id = parseInt(req.params.id);
		const idArticle = parseInt(req.params.idArticle);
		await res
			.status(200)
			.send(`Mise à jour de l'article ${idArticle} du flux ${id}`);
	} catch (error) {
		console.error(error);
		await res.status(500).send("Erreur serveur");
	}
};
