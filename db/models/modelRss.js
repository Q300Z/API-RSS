const mongoose = require('mongoose');

const rssFluxSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, required: true },
    creaDate: { type: String, required: true },
    upadateDate: { type: String, required: true }
});

module.exports = mongoose.model('fluxRss', rssFluxSchema);