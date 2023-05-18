const mongoose = require("mongoose");

const rssItemSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  link: { type: String, required: true },
  pubDate: { type: Date },
  author: { type: String },
  category: { type: mongoose.Schema.Types.Mixed },
  comments: { type: String },
  source: { type: mongoose.Schema.Types.ObjectId, required: true },
  read: { type: Boolean },
  read_time: { type: Number },
});

module.exports = mongoose.model("itemRss", rssItemSchema);
