const BaseCommand = require('../../utils/structures/BaseCommand');

const {
    MessageEmbed
} = require('discord.js');

module.exports = class PlayCommand extends BaseCommand {
    constructor() {
        super('play', {
            description: 'Search and play the song selected',
            usage: '!play <name of song>',
            example: '!play The Nights',
            category: 'Music',
            aliases: ['p']
        });
    }

    async run(client, message, args) {
        const query = args.join(" ");

        const {
            channel
        } = message.member.voice;
        if (!channel) return message.reply("Please join a voice channel!");

        const player = client.music.players.spawn({
            guild: message.guild,
            voiceChannel: channel,
            textChannel: message.channel
        });

        let i = 0;
        const searchResults = await client.music.search(query, message.author);
        const tracks = searchResults.tracks.slice(0, 3);
        const tracksInfo = tracks.map(r => `${++i}) [${r.title}](${r.uri})`).join(`\n`);

        const embed = new MessageEmbed()
            .setAuthor(client.user.username, client.user.displayAvatarURL())
            .setDescription(tracksInfo)
            .setColor('DARK_RED')
            .setFooter(`Music Results`);
        message.channel.send(embed);

        try {
            const filter = m => (message.author.id === m.author.id) && (m.content >= 1) && (m.content <= tracks.length);
            const response = await message.channel.awaitMessages(filter, {
                max: 1,
                time: 10000,
                errors: ['time']
            })

            if (response) {
                const entry = response.first().content;
                const player = client.music.players.get(message.guild.id);
                const track = tracks[entry - 1];
                player.queue.add(track);
                message.channel.send(`Enqueueing track: ${track.title}`);

                if (!player.playing) player.play();
            }
        } catch (error) {
            console.log(error);
        }
    }
}
