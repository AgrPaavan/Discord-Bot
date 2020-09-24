const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class NodeReconnectEvent extends BaseEvent {
    constructor() {
        super('nodeReconnect');
    }

    async run() {
        console.log(`Node reconnecting...`);
    }
}
