const BaseEvent = require('../../utils/structures/BaseEvent');
const StateManager = require('../../utils/StateManager');

const mongoose = require('mongoose');
const Guild = require('../../../database/models/guilds');
const GuildConfigurable = require('../../../database/models/guildConfigurable');

const flag = false;

const guildCommandPrefixes = new Map();

module.exports = class ReadyEvent extends BaseEvent {
    constructor() {
        super('ready');
    }
    async run(client) {
        console.log(`DeathSkull Bot online at ${new Date()}`);
        client.user.setActivity("!help", {
            type: "WATCHING"
        });

        client.guilds.cache.forEach(async guild => {
            const settings = await GuildConfigurable.findOne({
                guildID: guild.id
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) flag = true;
            });

            if (flag) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectId(),
                    guildID: guild.id,
                    ownerID: guild.ownerID
                });
                const newGuildConfigurable = new GuildConfigurable({
                    _id: mongoose.Types.ObjectId(),
                    guildID: guild.id,
                    cmdPrefix: '!',
                    suggestionCounter: 1
                });

                newGuild.save()
                    .catch(err => console.error(err));
                newGuildConfigurable.save()
                    .catch(err => console.error(err));
            }

            const guildId = settings.guildID;
            const prefix = settings.cmdPrefix;

            guildCommandPrefixes.set(guildId, prefix);
            StateManager.emit(`prefixFetched`, guildId, prefix);

            let channelCount = guild.channels.cache.filter(channel => channel.type === 'text' || channel.type === 'voice');
            channelCount = channelCount.size;
            const channelCountChannel = guild.channels.cache.find(channel => channel.name.startsWith(`Channel Count: `));
            if (channelCountChannel) {
                channelCountChannel.setName(`Channel Count: ${channelCount}`);
            }

            let roleCount = guild.roles.cache;
            roleCount = roleCount.size;
            const roleCountChannel = guild.channels.cache.find(channel => channel.name.startsWith(`Role Count: `));
            if (roleCountChannel) {
                roleCountChannel.setName(`Role Count: ${roleCount}`)
            }

            const memberCount = guild.memberCount;
            const memberCountChannel = guild.channels.cache.find(channel => channel.name.startsWith(`Member Count: `));
            if (memberCountChannel) {
                memberCountChannel.setName(`Member Count: ${memberCount}`);
            }

            let userCount = guild.members.cache.filter(member => !member.user.bot);
            userCount = userCount.size;
            const userCountChannel = guild.channels.cache.find(channel => channel.name.startsWith(`User Count: `));
            if (userCountChannel) {
                userCountChannel.setName(`User Count: ${userCount}`);
            }

            let botCount = guild.members.cache.filter(member => member.user.bot);
            botCount = botCount.size;
            const botCountChannel = guild.channels.cache.find(channel => channel.name.startsWith(`Bot Count: `));
            if (botCountChannel) {
                botCountChannel.setName(`Bot Count: ${botCount}`);
            }
        });
    }
}
