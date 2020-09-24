const mongoose = require('mongoose');

const guildConfigurableSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    cmdPrefix: {
        type: String,
        default: '!'
    },
    suggestionCounter: Number
});

module.exports = mongoose.model("GuildConfigurable", guildConfigurableSchema, "guildConfigurable");
