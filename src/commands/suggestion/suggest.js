const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class SuggestionSuggestCommand extends BaseCommand {
    constructor() {
        super('suggest', {
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
