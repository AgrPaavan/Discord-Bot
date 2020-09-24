const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class JoinCommand extends BaseCommand {
    constructor() {
        super('join', {
            description: 'Make the bot join the voice channel you are in',
            usage: '!join',
            example: '!join',
            category: 'Music',
            aliases: []
        });
    }

    async run(client, message, args) {
        const {
            channel
        } = message.member.voice;

        if (!channel) return message.reply("Please join a voice channel!");

        const player = client.music.players.spawn({
            guild: message.guild,
            voiceChannel: channel,
            textChannel: message.channel
        });
    }
}
