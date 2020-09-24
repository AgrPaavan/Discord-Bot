const BaseCommand = require('../../utils/structures/BaseCommand');

const {
    MessageEmbed
} = require('discord.js');

let used = false;
let skipped = false;

module.exports = class SkipCommand extends BaseCommand {
    constructor() {
        super('skip', {
            description: 'Skip the current song. To stop spoiling other\'s experience, the users will have to vote and if 60% people say yes, the song will be skipped',
            usage: '!skip',
            example: '!skip',
            category: 'Music',
            aliases: ['s']
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

        const members = channel.members.filter(m => !m.user.bot);
        if (members.size === 1) {
            player.stop();
            message.channel.send(`Skipping... ${player.queue[0].title}`);
        } else {
            if (!used) {
                used = true;
                const votesRequired = Math.ceil(members.size * .6);
                const embed = new MessageEmbed()
                    .setColor('DARK_RED')
                    .setDescription(`Total votes required to skip: ${votesRequired}`);
                const msg = await message.channel.send(`Confirm 👍 or Deny 👎`, embed);
                await msg.react('👍');
                await msg.react('👎');

                const filter = (reaction, user) => {
                    if (user.bot) return false;
                    const {
                        channel
                    } = message.guild.members.cache.get(user.id).voice;
                    if (channel) {
                        if (channel.id === player.voiceChannel.id) {
                            return ['👍'].includes(reaction.emoji.name);
                        }
                        return false;
                    } else {
                        return false;
                    }
                }

                try {
                    const reactions = await msg.awaitReactions(filter, {
                        max: votesRequired,
                        time: 10000,
                        errors: ['time']
                    });
                    const voteSkip = reactions.get('👍').users.cache.filter(u => !u.bot);
                    if (voteSkip.size >= votesRequired) {
                        player.stop();
                        message.channel.send(`Skipping... ${player.queue[0].title}`);
                        used = false;
                        skipped = true;
                    }
                } catch (err) {
                    console.log(err);
                    used = false;
                }
                if (!skipped) {
                    message.channel.send(`Not Skipping... ${player.queue[0].title}`);
                }
            } else {
                message.channel.send('Command cannot be used at the moment');
            }
        }
    }
}
