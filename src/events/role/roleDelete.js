const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class RoleDeleteEvent extends BaseEvent {
    constructor() {
        super('roleDelete');
    }

    async run(client, role) {
        let roleCount = role.guild.roles.cache;
        roleCount = roleCount.size;
        const roleCountChannel = role.guild.channels.cache.find(channel => channel.name.startsWith(`Role Count: `));
        if (roleCountChannel) {
            roleCountChannel.setName(`Role Count: ${roleCount}`)
        }
    }
}
