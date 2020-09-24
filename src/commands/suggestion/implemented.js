const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class SuggestionImplementedCommand extends BaseCommand {
    constructor() {
        super('implemented', {
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
