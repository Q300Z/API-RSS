const axios = require("axios");
const parser = require("xml2json");

const FluxRss = require("../db/models/modelFlux.js");
const ItemRss = require("../db/models/modelItem.js");
const { default: mongoose } = require("mongoose");

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
		console.log(req.body.link);
		//Récupére le flux rss xml
		const response = await axios.get(req.body.link);
		//Transforme le flux rss xml en json
		const jsonFlux = XmlToJson(response.data);
		//Génération de l'id du flux
		const source = new mongoose.Types.ObjectId();

		//Enregistre le flux dans mongodb
		await SaveFlux(jsonFlux, req.body.link, source);

		//Enregistre les artciles dans mongodb
		const articles = TransformName(jsonFlux, source);
		const promises = [];
		for (const i in articles) {
			promises.push(SaveItems(articles[i], source));
		}
		console.log(promises.length);
		await Promise.all(promises);

		res.status(201).json({ message: "Flux ajouté" });
	} catch (err) {
		res.status(500).send({ message: "Erreur dans l'ajout du flux", data: err });
		console.log(err);
	}
};
exports.modifyFlux = async (req, res, next) => {
	try {
		//code pour modifier un flux RSS
		FluxRss.updateOne(
			{ _id: req.params.id },
			{ ...req.body, _id: req.params.id },
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
			await ItemRss.deleteMany({ source: req.params.id });
			res.status(200).json({ message: `Suppression du Flux : ${flux.title}` });
		} else {
			res.status(404).json({
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
		//Liste des nouveaux articles
		var newArticles = [];

		const find = await FluxRss.find();
		if (!find) {
			res.status(404).json({ message: "Il n'y a pas Flux !" });
			return;
		}
		for (const flux of find) {
			//Recupere le XML
			const response = await axios.get(flux.link);
			//Transforme le flux rss xml en json
			const jsonFlux = XmlToJson(response.data);

			if (jsonFlux) {
				//Renvoie les articles formaté
				const articles = TransformName(jsonFlux, flux._id);
				//Enregistre les nouveaux articles et les revoies sous forme d'object
				NewArticle(articles, flux).then((els) => {
					els.forEach((el) => {
						newArticles.push(el);
					});
				});
			}
		}

		await res.status(200).json({
			message: "Met à jour  tous les flux rss",
			data: newArticles,
		});
	} catch (error) {
		console.error(error);
		await res.status(500).send("Erreur serveur");
	}
};

exports.updateFlux = async (req, res, next) => {
	try {
		// code pour mettre à jour un flux rss

		const find = await FluxRss.findById({ _id: req.params.id });
		if (!find) {
			res.status(404).json({ message: "Le Flux n'existe pas" });
			return;
		}

		for (const flux of find) {
			console.log(flux.link);
			//Recupere le XML
			const response = await axios.get(flux.link);
			//Transforme le flux rss xml en json
			const jsonFlux = XmlToJson(response.data);

			if (jsonFlux) {
				//Renvoie les articles formaté
				const articles = TransformName(jsonFlux, flux._id);
				NewArticle(articles, flux._id);
			}
		}
		await res.status(200).json({
			message: "Met à jour du Flux rss",
			data: newArticles,
		});
	} catch (error) {
		console.error(error);
		await res.status(500).send("Erreur serveur");
	}
};

async function SaveFlux(fluxJson, link, id) {
	try {
		// opérateur de déstructuration pour extraire directement les propriétés de l'objet fluxJson["rss"]["channel"] et les assigner aux propriétés correspondantes de l'objet flux. Thanks GPT
		const { title, description, pubDate, lastBuildDate, language } =
			fluxJson["rss"]["channel"];
		//Enregistre les informations du flux selon les modeles
		const flux = new FluxRss({
			_id: id,
			title,
			description,
			link: link,
			pubDate,
			lastBuildDate,
			language,
		});
		//Enregistre le flux dans mongodb
		await flux.save();
	} catch (error) {
		console.log(error);
	}
}

async function SaveItems(items, flux) {
	try {
		// opérateur de déstructuration pour extraire directement les propriétés de l'objet fluxJson["rss"]["channel"]["item"] et les assigner aux propriétés correspondantes de l'objet item. Thanks GPT
		const { title, description, link, pubDate, author, category, comments } =
			items;
		//Enregistre les informations des items selon les modeles
		const item = new ItemRss({
			title,
			description,
			link,
			pubDate,
			author,
			category,
			comments,
			source: flux,
		});
		//Enregistre l'item dans mongodb
		await item.save();
	} catch (error) {
		console.log(error);
	}
}

function TransformName(fluxJson, id) {
	try {
		//Retire le "dc" des nom des valeurs de l'object
		var items = fluxJson["rss"]["channel"]["item"];
		for (let el in items) {
			items[el]["source"] = id;
			for (let els in items[el]) {
				var parts = els.split(":");
				if (parts[0] == "dc") {
					items[el][parts[1]] = items[el][els];
					delete items[el][els];
				}
			}
		}
		return items;
	} catch (error) {
		console.log(error);
	}
}

function XmlToJson(data) {
	try {
		return parser.toJson(data, {
			object: true,
			alternateTextNode: true,
			sanitize: true,
			coerce: true,
		});
	} catch (error) {
		console.log(error);
		return false;
	}
}

async function NewArticle(articles, flux) {
	try {
		//Liste des nouveaux articles
		const newArticles = [];
		//Liste de toute les nouvelles enregistrement d'article dans la bdd)
		const promises = [];
		//Pour chaque article vérifier sont existance dans la bdd sinon l'enregistré
		for (const newArticle of articles) {
			const existArticle = await ItemRss.findOne({ title: newArticle.title });

			if (!existArticle) {
				promises.push(SaveItems(newArticle, flux._id));
				newArticles.push(newArticle);
			}
		}
		await Promise.all(promises);
		console.info(flux.link, " : ", newArticles.length);
		return newArticles;
	} catch (error) {
		console.log(error);
	}
}
