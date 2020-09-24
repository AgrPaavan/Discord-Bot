const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class SuggestionResetCounterCommand extends BaseCommand {
    constructor() {
        super('resetCounter', {
            description: '',
            usage: '',
            example: '',
            category: 'Suggestions',
            aliases: []
        });
    }

    async run(client, message, args) {

    }
}
