const mongoose = require('mongoose');

const rssItemSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String },
    pubDate: { type: Date },
    guid: { type: String },
    author: { type: String },
    category: { type: String },
    comments: { type: String }
});

module.exports = mongoose.model('ItemRss', rssItemSchema);