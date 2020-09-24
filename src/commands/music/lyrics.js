const BaseCommand = require('../../utils/structures/BaseCommand');

const {
    Command
} = require('discord.js-commando');
const {
    MessageEmbed
} = require('discord.js');

const fetch = require('node-fetch');
const cheerio = require('cheerio');

module.exports = class LyricsCommand extends BaseCommand {
    constructor() {
        super('lyrics', {
            description: 'Get the lyrics to the song currently playing',
            usage: '!lyrics',
            example: '!lyrics',
            category: 'Music',
            aliases: []
        });
    }

    async run(client, message, args) {
        const player = client.music.players.get(message.guild.id);
        let songName = player.queue[0].title;

        if (!songName) return message.channel.send(`There is no song playing right now.`);

        const sentMessage = await message.channel.send(`Searching for lyrics...`);

        songName = songName.replace(/ *\([^)]*\) */g, '');
        var url = `https://api.genius.com/search?q=${encodeURI(songName)}`;

        const headers = {
            Authorization: `Bearer ${process.env.GENIUS}`
        };

        try {
            var body = await fetch(url, {
                headers
            });
            var result = await body.json();
            const songPath = result.response.hits[0].result.api_path;
            // get lyrics
            url = `https://api.genius.com${songPath}`;
            body = await fetch(url, {
                headers
            });
            result = await body.json();

            const song = result.response.song;

            let lyrics = await getLyrics(song.url);
            lyrics = lyrics.replace(/(\[.+\])/g, '');
            if (!lyrics) {
                return message.channel.send(
                    'No lyrics have been found for your query, please try again and be more specific.'
                );
            }

            if (lyrics.length > 4095)
                return message.channel.send(
                    'Lyrics are too long to be returned in a message embed'
                );
            if (lyrics.length < 2048) {
                const lyricsEmbed = new MessageEmbed()
                    .setColor('DARK_RED')
                    .setDescription(lyrics.trim());
                sentMessage.edit('', lyricsEmbed);
            } else {
                // 2048 < lyrics.length < 4096
                const firstLyricsEmbed = new MessageEmbed()
                    .setColor('DARK_RED')
                    .setDescription(lyrics.slice(0, 2048));
                const secondLyricsEmbed = new MessageEmbed()
                    .setColor('DARK_RED')
                    .setDescription(lyrics.slice(2048, lyrics.length));
                sentMessage.edit('', firstLyricsEmbed);
                message.channel.send(secondLyricsEmbed);
            }

            await sentMessage.react('🗑️');
            const filter = (reaction, user) => ['🗑️'].includes(reaction.emoji.name) && (message.author.id === user.id);
            const collector = sentMessage.createReactionCollector(filter);
            collector.on('collect', async (reaction, user) => {
                if (reaction.emoji.name === '🗑️') {
                    collector.stop();

                    await sentMessage.delete();
                }
            })
        } catch (e) {
            console.log(e);
            return sentMessage.edit(
                'Something when wrong, please try again or be more specific'
            );
        }

        async function getLyrics(url) {
            const response = await fetch(url);
            const text = await response.text();
            const $ = cheerio.load(text);
            return $('.lyrics')
                .text()
                .trim();
        }
    }
}
