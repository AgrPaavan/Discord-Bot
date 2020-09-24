const BaseCommand = require('../../utils/structures/BaseCommand');

const {
    MessageEmbed
} = require('discord.js');

const ms = require('ms');

module.exports = class MuteCommand extends BaseCommand {
    constructor() {
        super('mute', {
            description: 'Mute a member in the server for the specified time. If time is not specified, a moderator will have to unmute him manually',
            usage: '!mute @<member> <time>',
            example: '!mute <@737182986939793551> \`OR\` !mute <@737182986939793551> 5d6h2m',
            category: 'Moderator',
            aliases: []
        });
    }

    async run(client, message, args) {
        if (!message.member.hasPermission("KICK_MEMBERS")) {
            message.delete();
            message.reply("Looks like you do not have the permission to execute this command!").then(r => r.delete({
                timeout: 5000
            }));;
            return;
        }

        const user = message.guild.member(message.mentions.users.first());
        if (!user) return message.reply("Couldn't find the specified User!");
        if (user.hasPermission("KICK_MEMBERS")) return message.reply("You cannot mute this user");
        if (user.hasPermission("ADMINISTRATOR")) return message.reply("Looks like you are trying to take contr of the sever but I cannot let that happen");

        var muteRole = message.guild.roles.cache.find(role => role.name === "Muted");
        if (!muteRole) {
            const filter = m => m.author.id === message.author.id

            message.channel.send(new Discord.MessageEmbed()
                .setTitle("Mute Role not Found")
                .setDescription("The Bot couldn't discover a mute role, if you already have a mute role setup, please rename it to `Muted`\nIf you want to setup a mute role please reply with a yes to this message otherwise reply with a no")
                .setTimestamp()
            ).then(r => r.delete({
                timeout: 10000
            }));

            const collected = await message.channel.awaitMessages(filter, {
                max: 1,
                time: 10000
            })
            if (collected.first().content.toLowerCase() === "yes") {
                message.channel.send("Setting up a mute role").then(r => r.delete({
                    timeout: 2000
                }));
                try {
                    muteRole = await message.guild.roles.create({
                        data: {
                            name: "Muted",
                            color: "#95a5a6",
                            permissions: []
                        }
                    });

                    message.guild.channels.cache.forEach(async (channel, id) => {
                        await channel.updateOverwrite(muteRole, {
                            SEND_MESSAGES: false,
                            ADD_REACTIONS: false
                        });
                    });
                } catch (e) {
                    console.log(e.stack);
                }
                message.channel.send("Role Created").then(r => r.delete({
                    timeout: 2000
                }));
            } else {
                return message.channel.send("Process Cancelled");
            }
        }

        const arg = message.content.split(' ');
        var input = arg.splice(2).join('');

        const regex = /(?<day>[0-9]{1,2}d)?(?<hour>[0-9]{1,2}h)?(?<minute>[0-9]{1,2}m)?/sg;
        const result = regex.exec(input);

        let d = result.groups.day;
        if (d === undefined) {
            d = 0 + 'd';
        }

        let h = result.groups.hour;
        if (h === undefined) {
            h = 0 + 'h';
        }

        let m = result.groups.minute;
        if (m === undefined) {
            m = 0 + 'm';
        }

        d = ms(d);
        h = ms(h);
        m = ms(m);
        const time = d + h + m;

        if (time) {
            await (user.roles.add(muteRole.id));
            user.send(new MessageEmbed()
                .setTitle(`Action: **MUTE**`)
                .setDescription(`You have been muted from ${message.guild.name}`)
                .setColor("DARK_RED")
                .setThumbnail(user.avatarURL())
                .addField('Duration', args[0])
                .setTimestamp()
                .setFooter(`By ${message.author.tag}`));
            setTimeout(function () {
                user.roles.remove(muteRole.id)
                user.send(new MessageEmbed()
                    .setTitle(`Action: **UNMUTE**`)
                    .setDescription(`You have been unmuted from ${message.guild.name}`)
                    .setColor("DARK_RED")
                    .setThumbnail(user.avatarURL())
                    .setTimestamp()
                    .setFooter(`By ${message.author.tag}`))
            }, (time));
        } else {
            user.roles.add(muteRole.id);
            user.send(new MessageEmbed()
                .setTitle(`Action: **MUTE**`)
                .setDescription(`You have been muted from ${message.guild.name}`)
                .setColor("DARK_RED")
                .setThumbnail(user.avatarURL())
                .setTimestamp()
                .setFooter(`By ${message.author.tag}`));
        }
    }
}
