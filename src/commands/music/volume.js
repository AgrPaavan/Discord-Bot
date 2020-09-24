const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class VolumeCommand extends BaseCommand {
    constructor() {
        super('volume', {
            description: 'Set the bot\'s volume. If no amount is pecified, it will will display the current volume fo the bot',
            usage: '!volume <amount>',
            example: '!volume **OR** !volume 50',
            category: 'Music',
            aliases: []
        });
    }

    async run(client, message, args) {
        const guildId = message.guild.id;
        const player = client.music.players.get(guildId);

        const {
            channel
        } = message.member.voice;
        if (!(player && channel)) return;
        if (player.voiceChannel.id !== channel.id) return;

        if (!args[0]) return message.channel.send(`Current Volume: ${player.volume}`);

        if (Number(args[0]) <= 0 || Number(args[0]) > 100) return message.channel.send("The volume needs to be between 1-100");

        await player.setVolume(Number(args[0]));
        message.channel.send(`Set Volume to: ${player.volume}`);
    }
}
