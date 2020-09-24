const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class NodeDisconnectEvent extends BaseEvent {
    constructor() {
        super('nodeDisconnect');
    }

    async run(error) {
        console.log(`Node disconnected.\nError Message: ${error.message}`);
    }
}
