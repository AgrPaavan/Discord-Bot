const BaseCommand = require('../../utils/structures/BaseCommand');

const Discord = require('discord.js');

module.exports = class KickCommand extends BaseCommand {
    constructor() {
        super('kick', {
            description: 'Kick a member from the server',
            usage: '!kick @<member',
            example: '!kick <@737182986939793551> **OR** !kick <@737182986939793551> Inappropriate Language',
            category: 'Moderator',
            aliases: []
        });
    }

    async run(client, message, args) {
        if (!message.member.hasPermission("KICK_MEMBERS")) {
            message.delete();
            message.reply("Looks like you do not have the permission to execute this command!").then(r => r.delete({
                timeout: 5000
            }));;
            return;
        }
        const user = message.mentions.users.first();
        const arg = message.content.split(' ');
        var reason = arg.splice(2).join(' ');
        if (!reason) reason = "No reason specified";
        if (user) {
            const member = message.guild.member(user);
            try {
                const embedKick = new Discord.MessageEmbed()
                    .setTitle(`Action: **KICK**`)
                    .setDescription(`You have been kicked from ${message.guild.name}`)
                    .setColor("DARK_RED")
                    .setThumbnail(user.avatarURL())
                    .addField("Reason", reason)
                    .setTimestamp()
                    .setFooter(`By ${message.author.tag}`);
                await user.send(embedKick);
            } catch (err) {
                console.log(err);
                message.channel.send("Unable to kick user");
            }
            // member.kick(reason);
        }
    }
}
