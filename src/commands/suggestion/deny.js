const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class SuggestionDenyCommand extends BaseCommand {
    constructor() {
        super('deny', {
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
