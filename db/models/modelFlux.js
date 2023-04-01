const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
    title: { type: String },
    url: { type: String },
    link: { type: String },
  });

const rssFluxSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, required: true, unique: true },
    pubDate: { type: String },
    lastBuildDate: { type: String },
    image: imageSchema,
    language: { type: String },
    enclosure: { type: String },
    copyright: { type: String },
    managingEditor: { type: String },
    webMaster: { type: String },
    generator: { type: String },
    docs: { type: String },
    ttl: { type: Number },
    rating: { type: String },
    textInput: { type: String }
});

module.exports = mongoose.model('fluxRss', rssFluxSchema);