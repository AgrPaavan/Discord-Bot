const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class NodeErrorEvent extends BaseEvent {
    constructor() {
        super('nodeError');
    }

    async run(error) {
        console.log(`Node Error\nError Message: ${error.message}`);
    }
}
