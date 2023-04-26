const mongoose = require("mongoose");

const rssFluxSchema = mongoose.Schema({
	_id: { type: mongoose.Schema.Types.ObjectId },
	title: { type: String, required: true },
	description: { type: String, required: true },
	link: { type: String, required: true, unique: true },
	pubDate: { type: String },
	lastBuildDate: { type: String },
	language: { type: String },
});

module.exports = mongoose.model("fluxRss", rssFluxSchema);
