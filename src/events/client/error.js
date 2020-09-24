const BaseEvent = require('../../utils/structures/BaseCommand');

module.exports = class ErrorEvent extends BaseEvent {
    constructor() {
        super('error');
    }

    async run(error) {
        console.log(error)
    }
}
