const BaseEvent = require('../../utils/structures/BaseEvent');
const StateManager = require('../../utils/StateManager');

const mongoose = require('mongoose');
const Guild = require('../../../database/models/guilds');
const GuildConfigurable = require('../../../database/models/guildConfigurable');

module.exports = class GuildDeleteEvent extends BaseEvent {
    constructor() {
        super('guildDelete');
    }

    async run(client, guild) {
        Guild.findOneAndDelete({
            guildID: guild.id
        }, (err, res) => {
            if (err) console.error(err)
        });
        GuildConfigurable.findOneAndDelete({
            guildID: guild.id
        }, (err, res) => {
            if (err) console.error(err)
        });
    }
}
