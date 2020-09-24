const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class ShardResumeEvent extends BaseEvent {
    constructor() {
        super('shardResume');
    }

    async run() {
        console.log(`DeathSkull Bot reconnected at ${new Date()}`);
    }
}
