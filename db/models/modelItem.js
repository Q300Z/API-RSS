const mongoose = require("mongoose");

const sourceSchema = mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
});

const enclosureSchema = mongoose.Schema({
  type: { type: String },
  url: { type: String },
  length: { type: Number },
});

const rssItemSchema = mongoose.Schema({
  title: { type: String, required: true},
  description: { type: String, required: true },
  link: { type: String, required: true},
  pubDate: { type: Date },
  author: { type: String },
  category: { type: String },
  comments: { type: String },
  enclosure: enclosureSchema,
  source: sourceSchema,
});

module.exports = mongoose.model("itemRss", rssItemSchema);
