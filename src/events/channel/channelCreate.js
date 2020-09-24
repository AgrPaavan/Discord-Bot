const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class ChannelCreateEvent extends BaseEvent {
    constructor() {
        super('channelCreate');
    }

    async run(client, channel) {
        if (channel.type === 'dm') return;

        let channelCount = channel.guild.channels.cache.filter(channel => channel.type === 'text' || channel.type === 'voice');
        channelCount = channelCount.size;
        const channelCountChannel = channel.guild.channels.cache.find(channel => channel.name.startsWith(`Channel Count: `));
        if (channelCountChannel) {
            channelCountChannel.setName(`Channel Count: ${channelCount}`);
        }
    }
}
