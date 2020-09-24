const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class MemberAddEvent extends BaseEvent {
    constructor() {
        super('guildMemberAdd');
    }

    async run(client, member) {
        const memberCount = member.guild.memberCount;
        const memberCountChannel = member.guild.channels.cache.find(channel => channel.name.startsWith(`Member Count: `));
        if (memberCountChannel) {
            memberCountChannel.setName(`Member Count: ${memberCount}`);
        }

        let userCount = member.guild.members.cache.filter(member => !member.user.bot);
        userCount = userCount.size;
        const userCountChannel = member.guild.channels.cache.find(channel => channel.name.startsWith(`User Count: `));
        if (userCountChannel) {
            userCountChannel.setName(`User Count: ${userCount}`);
        }

        let botCount = member.guild.members.cache.filter(member => member.user.bot);
        botCount = botCount.size;
        const botCountChannel = member.guild.channels.cache.find(channel => channel.name.startsWith(`Bot Count: `));
        if (botCountChannel) {
            botCountChannel.setName(`Bot Count: ${botCount}`);
        }
    }
}
