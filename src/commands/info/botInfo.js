const BaseCommand = require('../../utils/structures/BaseCommand');

const {
    MessageEmbed,
    version: djsversion
} = require('discord.js');
const {
    version
} = require('../../../package.json');
const {
    utc
} = require('moment');
const os = require('os');
const ms = require('ms');

module.exports = class BotInfoCommand extends BaseCommand {
    constructor() {
        super('botInfo', {
            description: 'Display Bot Information',
            usage: '!botInfo',
            example: '!botInfo',
            category: 'Information',
            aliases: []
        });
    }

    async run(client, message, args) {
        const core = os.cpus()[0];
        const embed = new MessageEmbed()
            .setThumbnail(client.user.avatarURL())
            .setColor('DARK_RED')
            .addField('General', [
                `**❯ Client:** ${client.user.tag} (${client.user.id})`,
                `**❯ Commands:** ${client.commands.size}`,
                `**❯ Servers:** ${client.guilds.cache.size.toLocaleString()} `,
                `**❯ Users:** ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}`,
                `**❯ Channels:** ${client.channels.cache.size.toLocaleString()}`,
                `**❯ Creation Date:** ${utc(client.user.createdTimestamp).format('Do MMMM YYYY HH:mm:ss')}`,
                `**❯ Node.js:** ${process.version}`,
                `**❯ Version:** v${version}`,
                `**❯ Discord.js:** v${djsversion}`,
                '\u200b'
            ])
            .addField('System', [
                `**❯ Platform:** ${process.platform}`,
                `**❯ Uptime:** ${ms(os.uptime() * 1000, { long: true })}`,
                `**❯ CPU:**`,
                `\u3000 Cores: ${os.cpus().length}`,
                `\u3000 Model: ${core.model}`,
                `\u3000 Speed: ${core.speed}MHz`,
                `**❯ Memory:**`,
                `\u3000 Total: ${formatBytes(process.memoryUsage().heapTotal)}`,
                `\u3000 Used: ${formatBytes(process.memoryUsage().heapUsed)}`
            ])
            .setTimestamp();

        message.channel.send(embed);
    }
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}
