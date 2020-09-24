const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class MemberCounterCommand extends BaseCommand {
    constructor() {
        super('memberCounter', {
            description: 'Setup Member Counter for this Server.\n**Please note that the channel names might not work perfectly due to recent changes in the Discord API**',
            usage: '!memberCounter',
            example: '!memberCounter',
            category: 'Member Counter',
            aliases: []
        });
    }

    async run(client, message, args) {
        if (!message.member.hasPermission("ADMINISTRATORS")) {
            message.delete();
            message.reply("Looks like you do not have the permission to execute command!").then(r => r.delete({
                timeout: 5000
            }));;
            return;
        }

        let category = await message.guild.channels.cache.filter(channel => channel.type === 'category').find(category => category.name === 'Member Count');
        if (!category) {
            category = await message.guild.channels.create('Member Count', {
                type: 'category'
            });
        }

        const memberCount = message.guild.memberCount;
        const memberCountChannel = message.guild.channels.cache.find(channel => channel.name.startsWith(`Member Count: `));
        if (!memberCountChannel) {
            await message.guild.channels.create(`Member Count: ${memberCount}`, {
                type: 'voice',
                parent: category.id,
                permissionOverwrites: [{
                    id: message.guild.roles.everyone,
                    allow: ['VIEW_CHANNEL'],
                    deny: ['CONNECT']
                }]
            });
        }

        let userCount = message.guild.members.cache.filter(member => !member.user.bot);
        userCount = userCount.size;
        const userCountChannel = message.guild.channels.cache.find(channel => channel.name.startsWith(`User Count: `));
        if (!userCountChannel) {
            await message.guild.channels.create(`User Count: ${userCount}`, {
                type: 'voice',
                parent: category.id,
                permissionOverwrites: [{
                    id: message.guild.roles.everyone,
                    allow: ['VIEW_CHANNEL'],
                    deny: ['CONNECT']
                }]
            });
        }

        let botCount = message.guild.members.cache.filter(member => member.user.bot);
        botCount = botCount.size;
        const botCountChannel = message.guild.channels.cache.find(channel => channel.name.startsWith(`Bot Count: `));
        if (!botCountChannel) {
            await message.guild.channels.create(`Bot Count: ${botCount}`, {
                type: 'voice',
                parent: category.id,
                permissionOverwrites: [{
                    id: message.guild.roles.everyone,
                    allow: ['VIEW_CHANNEL'],
                    deny: ['CONNECT']
                }]
            });
        }

        let channelCount = message.guild.channels.cache.filter(channel => channel.type === 'text' || channel.type === 'voice');
        channelCount = channelCount.size;
        const channelCountChannel = message.guild.channels.cache.find(channel => channel.name.startsWith(`Channel Count: `));
        if (!channelCountChannel) {
            await message.guild.channels.create(`Channel Count: ${channelCount + 1}`, {
                type: 'voice',
                parent: category.id,
                permissionOverwrites: [{
                    id: message.guild.roles.everyone,
                    allow: ['VIEW_CHANNEL'],
                    deny: ['CONNECT']
                }]
            });
        }

        let roleCount = message.guild.roles.cache;
        roleCount = roleCount.size;
        const roleCountChannel = message.guild.channels.cache.find(channel => channel.name.startsWith(`Role Count: `));
        if (!roleCountChannel) {
            await message.guild.channels.create(`Role Count: ${roleCount}`, {
                type: 'voice',
                parent: category.id,
                permissionOverwrites: [{
                    id: message.guild.roles.everyone,
                    allow: ['VIEW_CHANNEL'],
                    deny: ['CONNECT']
                }]
            });
        }
    }
}
