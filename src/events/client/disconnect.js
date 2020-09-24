const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class ShardDisconnectEvent extends BaseEvent {
    constructor() {
        super('shardDisconnect');
    }

    async run() {
        console.log(`DeathSkull Bot got disconnected at ${new Date()}`);
    }
}
