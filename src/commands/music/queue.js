const BaseCommand = require("../../utils/structures/BaseCommand");

const {
    MessageEmbed
} = require('discord.js');

module.exports = class QueueCommand extends BaseCommand {
    constructor() {
        super('queue', {
            description: 'Display the current song queue',
            usage: '!queue',
            example: '!queue',
            category: 'Music',
            aliases: []
        });
    }

    async run(client, message, args) {
        const player = client.music.players.get(message.guild.id);
        if (!player) return message.channel.send(`Bot is not in a channel`);

        let currentPage = 0;
        const embeds = generateQueueEmbed(player.queue);

        const queueEmbed = await message.channel.send(`Current Page: ${currentPage+1}/${embeds.length}`, embeds[currentPage]);
        await queueEmbed.react('◀️');
        await queueEmbed.react('▶️');
        await queueEmbed.react('🗑️');

        const filter = (reaction, user) => ['◀️', '▶️', '🗑️'].includes(reaction.emoji.name) && (message.author.id === user.id);
        const collector = queueEmbed.createReactionCollector(filter);

        collector.on('collect', async (reaction, user) => {
            if (reaction.emoji.name === '▶️') {
                if (currentPage < embeds.length - 1) {
                    currentPage++;

                    queueEmbed.edit(`Current Page:${currentPage+1}/${embeds.length}`, embeds[currentPage]);

                    await reaction.users.remove(message.author.id);
                }
            } else if (reaction.emoji.name === '◀️') {
                if (currentPage !== 0) {
                    --currentPage;

                    queueEmbed.edit(`Current Page:${currentPage+1}/${embeds.length}`, embeds[currentPage]);

                    await reaction.users.remove(message.author.id);
                }
            } else {
                collector.stop();

                await queueEmbed.delete();
            }
        });
    }
}

function generateQueueEmbed(queue) {
    const embeds = [];

    let k = 10;
    for (let i = 0; i < queue.length; i += 10) {
        const current = queue.slice(i, k);

        let j = i;
        k += 10;

        const info = current.map(track => `${++j}) [${track.title}](${track.uri})`).join('\n');
        const embed = new MessageEmbed()
            .setDescription(`**[Current Song: ${queue[0].title}](${queue[0].uri})**\n${info}`)
            .setColor('DARK_RED');

        embeds.push(embed);
    }
    return embeds;
}
