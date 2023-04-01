const mongoose = require('mongoose');

const rssFluxSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, required: true },
    pubDate: { type: Date },
    lastBuildDate: { type: Date },
    image: { type: String },
    language: { type: String },
    enclosure: { type: String }
});

module.exports = mongoose.model('fluxRss', rssFluxSchema);