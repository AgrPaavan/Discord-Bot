const BaseCommand = require('../../utils/structures/BaseCommand');

const {
    MessageEmbed
} = require('discord.js');

const selections = new Set();
const constants = ['queueall', 'stopselect'];

module.exports = class SearchCommand extends BaseCommand {
    constructor() {
        super('search', {
            description: 'Search and queue multiple tracks according to the search term',
            usage: '!search <term>',
            example: '!search Avicii',
            category: 'Music',
            aliases: []
        });
    }

    async run(client, message, args) {
        const query = args.join(' ');

        const {
            channel
        } = message.member.voice;

        const player = client.music.players.spawn({
            guild: message.guild,
            voiceChannel: channel,
            textChannel: message.channel
        });

        if (!(channel && player)) return message.channel.send('Not in a voice channel or player doesn\'t exist');
        if (channel.id !== player.voiceChannel.id) return;

        let i = 0;
        const searchResults = await client.music.search(query, message.author);
        const tracks = searchResults.tracks.slice(0, 10);
        const tracksInfo = tracks.map(track => `${++i}) [${track.title}](${track.uri})`).join(`\n`);

        const embed = new MessageEmbed()
            .setAuthor(client.user.username, client.user.displayAvatarURL())
            .setDescription(tracksInfo)
            .setColor('DARK_RED')
            .setFooter(`Music Results`);
        message.channel.send(`type \`**stopslect**\` after you are done or \`**queueall**\` if you want to queue all songs`, embed);

        const filter = (m => (m.author.id === message.author.id) &&
            (channel.id === player.voiceChannel.id) &&
            ((m.content >= 1) && (m.content <= tracks.length)) ||
            (constants.includes(m.content.toLowerCase())));
        const collector = message.channel.createMessageCollector(filter);

        const tracksToQueue = await handleCollector(collector, tracks);

        i = 0;
        const selectedTracksInfo = tracksToQueue.map(track => `${++i}) [${track.title}](${track.uri})`).join(`\n`);

        const selectedTracks = new MessageEmbed()
            .setAuthor(client.user.username, client.user.displayAvatarURL())
            .setDescription(selectedTracksInfo)
            .setColor('DARK_RED')
            .setFooter(`Music Results`);
        const msg = await message.channel.send(`Confirm 👍 or Deny 👎`, selectedTracks);
        await msg.react('👍');
        await msg.react('👎');

        try {
            const reactionFilter = (reaction, user) => ['👍', '👎'].includes(reaction.emoji.name) && (user.id === message.author.id);
            const reactions = await msg.awaitReactions(reactionFilter, {
                max: 1,
                time: 10000,
                errors: ['time']
            });

            const selectedReaction = reactions.get('👍') || reactions.get('👎');
            if (selectedReaction.emoji.name === '👍') {
                for (const track of tracksToQueue) {
                    player.queue.add(track);
                }
                message.channel.send(`${tracks.length} tracks have been added to the queue.`);

                if (!player.playing) player.play();
            } else {
                message.channel.send(`Cancelled. Did not queue any track.`);
            }
        } catch (err) {
            console.log(err);
        }
    }
}

function handleCollector(collector, tracks) {
    const tracksToQueue = [];

    return new Promise((resolve, reject) => {
        try {
            collector.on('collect', message => {
                if (message.content.toLowerCase() === 'queueall') {
                    collector.stop();
                    selections.clear();
                    resolve(tracks);
                } else if (message.content.toLowerCase() === 'stopselect') {
                    collector.stop();
                    selections.clear();
                    resolve(tracksToQueue);
                } else {
                    const entry = message.content;
                    if (selections.has(entry)) {
                        message.channel.send(`You hae already selected that track`);
                    } else {
                        message.channel.send(`You have selected: ${tracks[entry - 1].title}`);
                        tracksToQueue.push(tracks[entry - 1]);
                        selections.add(entry);
                    }
                }
            });
        } catch (err) {
            reject(err);
        }
    })
}
