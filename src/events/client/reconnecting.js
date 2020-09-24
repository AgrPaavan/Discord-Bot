const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class ShardReconnectingEvent extends BaseEvent {
    constructor() {
        super('shardReconnecting');
    }

    async run() {
        console.log(`DeathSkull Bot is reconnecting at ${new Date()}`);
    }
}
