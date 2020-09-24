const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class SuggestionApproveCommand extends BaseCommand {
    constructor() {
        super('approve', {
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
