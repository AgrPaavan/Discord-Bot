const BaseCommand = require('../../utils/structures/BaseCommand');

const usedCommand = new Set();

module.exports = class ClearCommand extends BaseCommand {
    constructor() {
        super('clear', {
            description: 'Clear the specified number of messages from a channel. If the amount is not defined, the bot will delete past 100 messages',
            usage: '!clear <amount>',
            example: '!clear **OR** !clear 25',
            category: 'Moderator',
            aliases: []
        });
    }

    async run(client, message, args) {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            message.delete();
            message.reply("Looks like you do not have the permission to execute this command!").then(r => r.delete({
                timeout: 5000
            }));;
            return;
        }

        if (usedCommand.has(message.author.id)) {
            return;
        } else {
            usedCommand.add(message.content.id);
            var deleteAmount;
            if (parseInt(args[0]) > 99 || isNaN(args[0])) {
                deleteAmount = 99;
            } else {
                deleteAmount = parseInt(args[0]);
            }

            await message.channel.messages.fetch({
                limit: deleteAmount + 1
            }).then(messages => {
                message.channel.bulkDelete(messages).catch(err => console.log(err))
            });

            message.channel.send(`Deleted ${deleteAmount + 1} messages!`).then(r => r.delete({
                timeout: 5000
            }));

            usedCommand.add(message.author.id);
            setTimeout(() => {
                usedCommand.delete(message.author.id);
            }, 3000);
        }
    }
}
