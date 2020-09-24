const BaseCommand = require('../../utils/structures/BaseCommand');

const {
    MessageEmbed
} = require('discord.js');

let used = false;
let shuffled = false;

module.exports = class ShuffleCommand extends BaseCommand {
    constructor() {
        super('shuffleQueue', {
            description: 'Shuffle the queue. To stop spoiling other\'s experience, the users will have to vote and if 60% people say yes, the queue will be shuffled',
            usage: '!shuffleQueue',
            example: '!shuffleQueue',
            category: 'Music',
            aliases: ['sq']
        });
    }

    async run(client, message, args) {
        const {
            channel
        } = message.member.voice;
        const player = client.music.players.get(message.guild.id);

        if (!(channel && player)) return;
        if (channel.id !== player.voiceChannel.id) return;

        const members = channel.members.filter(m => !m.user.bot);
        if (members.size === 1) {
            player.queue.shuffle();
            message.channel.send(`Shuffled the queue.`);
        } else {
            if (!used) {
                used = true;
                const votesRequired = Math.ceil(members.size * .6);
                const embed = new MessageEmbed()
                    .setColor('DARK_RED')
                    .setDescription(`Total votes required to shuffle: ${votesRequired}`);
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
                    const voteShuffle = reactions.get('👍').users.cache.filter(u => !u.bot);
                    if (voteShuffle.size >= votesRequired) {
                        player.queue.shuffle();
                        message.channel.send(`Shuffled the queue.`);
                        used = false;
                        shuffled = true;
                    }
                } catch (err) {
                    console.log(err);
                    used = false;
                }
                if (!shuffled) {
                    message.channel.send(`Not shuffling the queue.`);
                }
            } else {
                message.channel.send('Command cannot be used at the moment');
            }
        }

    }
}
