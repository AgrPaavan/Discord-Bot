const BaseEvent = require("../../utils/structures/BaseEvent");
const StateManager = require("../../utils/StateManager");

const guildCommandPrefixes = new Map();

module.exports = class MessageEvent extends BaseEvent {
    constructor() {
        super('message');
    }

    async run(client, message) {
        const mentionRegex = RegExp(`^<@!${client.user.id}>$`);
        const mentionRegexPrefix = RegExp(`^<@!${client.user.id}> `);

        if (message.author.bot) return;

        const prefix = guildCommandPrefixes.get(message.guild.id);

        if (message.content.match(mentionRegex)) message.channel.send(`My prefix for ${message.guild.name} is \`${prefix}\`.`);

        const usedPrefix = message.content.match(mentionRegexPrefix) ?
            message.content.match(mentionRegexPrefix)[0] : prefix;

        if (!message.content.startsWith(usedPrefix)) return;

        const [cmdName, ...cmdArgs] = message.content.slice(usedPrefix.length).split(/\s+/);

        const command = (client.commands.get(cmdName) || client.aliases.get(cmdName));
        if (!command) return;

        command.run(client, message, cmdArgs);
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
