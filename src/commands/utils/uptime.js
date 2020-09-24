const BaseCommand = require('../../utils/structures/BaseCommand');

const {
    MessageEmbed
} = require('discord.js');

module.exports = class UptimeCommand extends BaseCommand {
    constructor() {
        super('uptime', {
            description: 'Get the bot\'s uptime',
            usage: '!uptime',
            example: '!uptime',
            category: 'Utilities',
            aliases: []
        });
    }

    async run(client, message, args) {
        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        var uptime;
        if (days === 0) {
            if (hours === 0) {
                if (minutes === 0) {
                    uptime = `${seconds} seconds`;
                } else {
                    uptime = `${minutes} minutes,\n${seconds} seconds`;
                }
            } else {
                uptime = `${hours} hours,\n${minutes} minutes,\n${seconds} seconds`;
            }
        } else {
            uptime = `${days} days,\n${hours} hours,\n${minutes} minutes,\n${seconds} seconds`;
        }

        message.delete();
        message.channel.send(new MessageEmbed()
            .setTitle("Uptime")
            .setDescription(uptime)
            .setColor("DARK_RED")
            .setThumbnail(client.user.displayAvatarURL()));
    }
}
