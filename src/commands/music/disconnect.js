const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class DisconnectCommand extends BaseCommand {
    constructor() {
        super('disconnect', {
            description: 'Disconnect bot from voice channel',
            usage: '!disconnect',
            example: '!disconnect',
            category: 'Music',
            aliases: ['dc']
        });
    }

    async run(client, message, args) {
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You just didn't");

        const {
            id
        } = message.guild;
        const {
            channel
        } = message.member.voice;
        const player = client.music.players.get(id);

        if (player && channel) {
            if (player.voiceChannel.id === channel.id) {
                client.music.players.destroy(id);
            }
        }
    }
}
