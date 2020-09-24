const BaseEvent = require('../../utils/structures/BaseEvent');

const {
    MessageEmbed
} = require('discord.js');

module.exports = class TrackStartEvent extends BaseEvent {
    constructor() {
        super('trackStart');
    }

    async run(client, player, track) {
        try {
            const millis = track.duration;
            var minutes = Math.floor(millis / 60000);
            var seconds = ((millis % 60000) / 1000).toFixed(0);

            let nextTitle, nextURI;
            try {
                nextTitle = player.queue[1].title;
                nextURI = player.queue[1].uri;
            } catch (e) {
                nextTitle = 'Nothing';
                nextURI = '';
            }
            const embed = new MessageEmbed()
                .setTitle(`Now Playing 🎵`)
                .setDescription(`[${track.title}](${track.uri})`)
                .addField(`Length`, `${minutes}:${seconds}`)
                .addField(`Requested by`, track.requester.username)
                .addField(`Up Next`, `[${nextTitle}](${nextURI})`)
                .setThumbnail(player.queue[0].displayThumbnail());

            const sentMessage = await player.textChannel.send(`Only the requester can play and pause the song \nReact with '▶️' to pause the song \nReact with '⏸️' to puase the song \nReact with '❌' to remove play/pause functionality for this song`, embed);
            await sentMessage.react('▶️');
            await sentMessage.react('⏸️');
            await sentMessage.react('❌');

            const filter = (reaction, user) => ['▶️', '⏸️', '❌'].includes(reaction.emoji.name) && (track.requester.id === user.id);
            const collector = sentMessage.createReactionCollector(filter);

            collector.on('collect', async (reaction, user) => {
                if (reaction.emoji.name === '▶️') {
                    if (player.playing) {
                        await player.textChannel.send("The track is already playing");
                        await reaction.users.remove(user.id);
                        return;
                    }

                    player.pause(false);
                    player.textChannel.send(`Resumed... ${track.title}`);

                    await reaction.users.remove(user.id);
                } else if (reaction.emoji.name === '⏸️') {
                    if (!player.playing) {
                        await player.textChannel.send("The track is already paused");
                        await reaction.users.remove(user.id);
                        return;
                    }

                    player.pause(true);
                    player.textChannel.send(`Paused... ${track.title}`);

                    await reaction.users.remove(user.id)
                } else if (reaction.emoji.name === '❌') {
                    await sentMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));

                    await player.textChannel.send(`Removed play/pause functionality for \`${track.title}\` \nRequested by: \`${track.requester.username}\``);

                    collector.stop();
                }
            })

            if (player.queue[[1]]) {
                client.on('trackEnd', async () => {
                    player.textChannel.send(`Just Ended: ${track.title}`);

                    await sentMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));

                    collector.stop();
                });
            } else {
                client.on('queueEnd', async () => {
                    player.textChannel.send("Queue has ended.");
                    client.players.destroy(player.guild.id);

                    await sentMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));

                    collector.stop();
                });
            }

        } catch (Err) {
            console.log(Err);
        }
    }
}
