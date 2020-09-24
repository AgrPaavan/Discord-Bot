const BaseCommand = require("../../utils/structures/BaseCommand");

const {
    MessageEmbed
} = require('discord.js');

module.exports = class BanCommand extends BaseCommand {
    constructor() {
        super('ban', {
            description: 'Ban a member from the server',
            usage: '!ban @<member> <reason(optional)>',
            example: '!ban <@737182986939793551> **OR** !ban <@737182986939793551> Inappropriate Language',
            category: 'Moderator',
            aliases: []
        });
    }

    async run(client, message, args) {
        if (!message.member.hasPermission("BAN_MEMBERS")) {
            message.delete();
            message.reply("Looks like you do not have the permission to execute this command!").then(r => r.delete({
                timeout: 5000
            }));;
            return;
        }
        const user = message.mentions.users.first();
        const arg = message.content.split(' ');
        let reason = arg.splice(2).join(' ');
        if (!reason) reason = "No reason specified";
        if (user) {
            const member = message.guild.member(user);
            try {
                const embedBan = new MessageEmbed()
                    .setTitle(`Action: **BAN**`)
                    .setDescription(`You have been banned from ${message.guild.name}`)
                    .setColor("DARK_RED")
                    .setThumbnail(user.avatarURL())
                    .addField("Reason", reason)
                    .setTimestamp()
                    .setFooter(`By ${message.author.tag}`);
                await user.send(embedBan);
            } catch (err) {
                console.log(err);
                message.channel.send("Unable to ban user");
            }
            // member.ban(reason);
        } else {
            message.channel.send(`User not in guild`);
        }
    }
}
