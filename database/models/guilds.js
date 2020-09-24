const mongoose = require('mongoose');

const guildsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    ownerID: String
});

module.exports = mongoose.model("Guild", guildsSchema, 'guilds');
