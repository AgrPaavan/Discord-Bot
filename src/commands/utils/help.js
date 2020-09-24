const BaseCommand = require('../../utils/structures/BaseCommand');
const StateManager = require('../../utils/StateManager');

const {
    MessageEmbed
} = require('discord.js');

guildCommandPrefixes = new Map();

module.exports = class HelpCommand extends BaseCommand {
    constructor() {
        super('help', {
            description: 'Display help for the bot or help for a specific command if specified',
            usage: '!help <command name>',
            example: '!help OR !help ban',
            category: 'Utilities',
            aliases: []
        });
    }

    async run(client, message, args) {
        message.delete();

        if (!args[0]) {
            const info = new MessageEmbed()
                .setAuthor(`Information Commands`, message.guild.iconURL())
                .setColor('DARK_RED')
                .setDescription(`The prefix for this guild is: \`${guildCommandPrefixes.get(message.guild.id)}\` \n\nAll command available are: `)
                .addField(`!botInfo`, `\:o: Display Bot Information`)
                .addField(`!serverInfo`, `\:o: Display Server Information`)
                .addField(`!userInfo **OR** !userInfo @<member>`, `\:o: Display your information or another user\'s information if member is mentioned`);

            const utils = new MessageEmbed()
                .setAuthor(`Utility Commands`, message.guild.iconURL())
                .setColor('DARK_RED')
                .setDescription(`The prefix for this guild is: \`${guildCommandPrefixes.get(message.guild.id)}\` \n\nAll command available are: `)
                .addField(`!help **OR** !help <command>`, `\:o: Display help for the bot or help for a specific command if specified`)
                .addField(`!ping`, `\:o: Get the ping of the bot`)
                .addField(`!uptime`, `\:o: Get the bot\'s uptime`);

            const music = new MessageEmbed()
                .setAuthor(`Music Commands`, message.guild.iconURL())
                .setColor('DARK_RED')
                .setDescription(`The prefix for this guild is: \`${guildCommandPrefixes.get(message.guild.id)}\` \n\nAll command available are: `)
                .addField(`!join`, `\:o: Make the bot join the voice channel you are in`)
                .addField(`!disconnect`, `\:o: Disconnect bot from voice channel`)
                .addField(`!play <song>`, `\:o: Search and play the song selected`)
                .addField(`!search <term>`, `\:o: Search and queue multiple tracks according to the search term`)
                .addField(`!nowPlaying`, `\:o: Display the song currently playing`)
                .addField(`!skip`, `\:o: Skip the current song. To stop spoiling other\'s experience, the users will have to vote and if 60% people say yes, the song will be skipped`)
                .addField(`!lyrics`, `\:o: Get the lyrics to the song currently playing`)
                .addField(`!queue`, `\:o: Display the current song queue`)
                .addField(`!shuffleQueue`, `\:o: Shuffle the queue. To stop spoiling other\'s experience, the users will have to vote and if 60% people say yes, the queue will be shuffled`)
                .addField(`!volume **OR** !volume <amount>`, `\:o: Set the bot\'s volume. If no amount is pecified, it will will display the current volume fo the bot`);

            const mod = new MessageEmbed()
                .setAuthor(`Moderator Commands`, message.guild.iconURL())
                .setColor('DARK_RED')
                .setDescription(`The prefix for this guild is: \`${guildCommandPrefixes.get(message.guild.id)}\` \n\nAll command available are: `)
                .addField(`!ban @<member> <reason (options)>`, `\:o: Ban a member from the server`)
                .addField(`!kick @<member> <reason (optional)>`, `\:o: Kick a member from the server`)
                .addField(`!clear **OR** !clear <amount>`, `\:o: Clear the specified number of messages from a channel. If the amount is not defined, the bot will delete past 100 messages`)
                .addField(`!mute @<member> **OR** !mute @<member> <time(5d3h10m)>`, `\:o: Mute a member in the server for the specified time. If time is not specified, a moderator will have to unmute him manually`)
                .addField(`!unmute @<member>`, `\:o: Unmute a member in the server`);

            const admin = new MessageEmbed()
                .setAuthor(`Administrator Commands`, message.guild.iconURL())
                .setColor('DARK_RED')
                .setDescription(`The prefix for this guild is: \`${guildCommandPrefixes.get(message.guild.id)}\` \n\nAll command available are: `)
                .addField(`!prefix <newPrefix>`, `\:o: Change the prefix for this server`);

            let currentPage = 0;
            const embeds = [utils, music, info, mod, admin];

            const helpEmbed = await message.channel.send(`Current Page: ${currentPage+1}/${embeds.length}`, embeds[currentPage]);
            await helpEmbed.react('◀️');
            await helpEmbed.react('▶️');
            await helpEmbed.react('🗑️');

            helpEmbed.delete({
                timeout: 300000
            });

            const filter = (reaction, user) => ['◀️', '▶️', '🗑️'].includes(reaction.emoji.name) && (message.author.id === user.id);
            const collector = helpEmbed.createReactionCollector(filter);

            collector.on('collect', async (reaction, user) => {
                if (reaction.emoji.name === '▶️') {
                    if (currentPage < embeds.length - 1) {
                        currentPage++;

                        helpEmbed.edit(`Current Page:${currentPage+1}/${embeds.length}`, embeds[currentPage]);

                        await reaction.users.remove(message.author.id);
                    }
                } else if (reaction.emoji.name === '◀️') {
                    if (currentPage !== 0) {
                        --currentPage;

                        helpEmbed.edit(`Current Page:${currentPage+1}/${embeds.length}`, embeds[currentPage]);

                        await reaction.users.remove(message.author.id);
                    }
                } else {
                    collector.stop();

                    await helpEmbed.delete();
                }
            });
        } else {
            let command = client.commands.get(args[0]);
            if (!command) return message.channel.send(`Invalid Command: ${args[0]}`);

            let alias = `${(JSON.stringify(command.aliases) !== '[]') ? command.aliases.join(", ") : "None"}`;


            const embed = new MessageEmbed()
                .setAuthor(`${message.guild.name} Help`, message.guild.iconURL())
                .setDescription(`The bot\'s prefix for this server is: \`${guildCommandPrefixes.get(message.guild.id)}\` \n
                \`Command:\` ${command.name}
                \`Description:\` ${command.description}
                \`Usage:\` ${command.usage}
                \`Example:\` ${command.example}
                \`Category:\` ${command.category}
                \`Aliases:\` ${alias}`)
                .setColor('DARK_RED')
                .setThumbnail(client.user.avatarURL());

            message.channel.send(embed);
        }
    }
}

StateManager.on('prefixFetched', (guildId, prefix) => {
    guildCommandPrefixes.set(guildId, prefix);
});

StateManager.on('prefixUpdate', (guildId, prefix) => {
    guildCommandPrefixes.set(guildId, prefix);
});

StateManager.on('guildAdded', (guildId, prefix) => {
    guildCommandPrefixes.set(guildId, prefix);
});
