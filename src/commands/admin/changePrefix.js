const BaseCommand = require('../../utils/structures/BaseCommand');
const StateManager = require("../../utils/StateManager");

const mongoose = require('mongoose');
const Guild = require('../../../database/models/guilds');
const GuildConfigurable = require('../../../database/models/guildConfigurable');

const guildCommandPrefixes = new Map();

module.exports = class ChangePrefixCommand extends BaseCommand {
    constructor() {
        super('prefix', {
            description: 'Change the prefix for this server',
            usage: '!prefix <new prefix>',
            example: '!prefix ?',
            category: 'Administrator',
            aliases: []
        });
    }

    async run(client, message, args) {
        if (!message.member.hasPermission("ADMINISTRATORS")) {
            message.delete();
            message.reply("Looks like you do not have the permission to execute command!").then(r => r.delete({
                timeout: 5000
            }));;
            return;
        }

        let newPrefix = args.join('');

        if (newPrefix === '\'' || newPrefix === '\"' || newPrefix === '\\') return message.channel.send("Invalid Prefix");
        if (!newPrefix) return message.channel.send("Please enter a new prefix");

        const settings = await GuildConfigurable.findOne({
            guildID: message.guild.id
        }, (err, guild) => {
            if (err) return console.error(err);
            if (!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectId(),
                    guildID: message.guild.id,
                    ownerID: message.guild.ownerID
                });
                const newGuildConfigurable = new GuildConfigurable({
                    _id: mongoose.Types.ObjectId(),
                    guildID: message.guild.id,
                    cmdPrefix: newPrefix,
                    suggestionCounter: 1
                });

                newGuild.save()
                    .catch(err => console.error(err));
                newGuildConfigurable.save()
                    .catch(err => console.error(err));

                return message.channel.send(`This server was not in out database! We have added it. The prefix is now set to ${newPrefix}`).then(m => m.delete({
                    timeout: 10000
                }));
            }
        });

        await settings.updateOne({
            cmdPrefix: newPrefix
        });

        guildCommandPrefixes.set(message.guild.id, newPrefix);
        message.channel.send(`Guild Prefix updated by \`${message.author.username}\` to \`${newPrefix}\``);
        StateManager.emit('prefixUpdate', message.guild.id, newPrefix);
    }
}
