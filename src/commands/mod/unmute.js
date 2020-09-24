const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class UnmuteCommand extends BaseCommand {
    constructor() {
        super('unmute', {
            description: 'Unmute a member in the server',
            usage: '!mute @<member>',
            example: '!unmute <@737182986939793551>',
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

        const user = message.guild.member(message.mentions.users.first());
        if (!user) return message.reply("Couldn't find the specified User!");
        if (user.hasPermission("KICK_MEMBERS")) return message.reply("You cannot unnmute this user");
        if (user.hasPermission("ADMINISTRATOR")) return message.reply("Looks like you are trying to take contr of the sever but I cannot let that happen");

        const muteRole = message.guild.roles.cache.find(role => role.name === "Muted");

        user.roles.remove(muteRole.id);
        user.send(new MessageEmbed()
            .setTitle(`Action: **UNMUTE**`)
            .setDescription(`You have been unmuted from ${message.guild.name}`)
            .setColor("DARK_RED")
            .setThumbnail(user.avatarURL())
            .setTimestamp()
            .setFooter(`By ${message.author.tag}`))
    }
}
