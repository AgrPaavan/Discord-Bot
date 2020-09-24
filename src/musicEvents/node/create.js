const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class NodeCreateEvent extends BaseEvent {
    constructor() {
        super('nodeCreate');
    }

    async run() {
        console.log(`New Node Create`);
    }
}
