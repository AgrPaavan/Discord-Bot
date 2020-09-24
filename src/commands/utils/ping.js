const BaseCommand = require('../../utils/structures/BaseCommand');

const {
    MessageEmbed
} = require('discord.js');

module.exports = class PingCommand extends BaseCommand {
    constructor() {
        super('ping', {
            description: 'Get the ping of the bot',
            usage: '!ping',
            example: '!ping',
            category: 'Utilities',
            aliases: []
        });
    }

    async run(client, message, args) {
        message.delete();

        let ping = client.ws.ping;

        message.channel.send((new MessageEmbed()
            .setTitle("Ping")
            .setDescription(`${ping}ms`)
            .setThumbnail(client.user.displayAvatarURL())
            .setColor("DARK_RED")));
    }
}
