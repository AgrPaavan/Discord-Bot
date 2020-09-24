const BaseEvent = require('../../utils/structures/BaseEvent');
const StateManager = require('../../utils/StateManager');

const mongoose = require('mongoose');
const Guild = require('../../../database/models/guilds');
const GuildConfigurable = require('../../../database/models/guildConfigurable');

module.exports = class GuildCreateEvent extends BaseEvent {
    constructor() {
        super('guildCreate');
    }

    async run(client, guild) {
        let newGuild = new Guild({
            _id: mongoose.Types.ObjectId(),
            guildID: guild.id,
            ownerID: guild.owner.id
        });
        newGuild.save()
            .catch(err => console.log(err));

        let newGuildConfigurable = new GuildConfigurable({
            _id: mongoose.Types.ObjectId(),
            guildID: guild.id,
            cmdPrefix: '!',
            suggestionCounter: 1
        });
        newGuildConfigurable.save()
            .catch(err => console.log(err));

        StateManager.emit('guildAdded', newGuildConfigurable.guildID, newGuildConfigurable.cmdPrefix);
    }
}
