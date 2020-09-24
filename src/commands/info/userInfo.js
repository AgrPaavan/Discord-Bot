const BaseCommand = require('../../utils/structures/BaseCommand');

const {
    MessageEmbed
} = require('discord.js');
const moment = require('moment');

const flags = {
    DISCORD_EMPLOYEE: 'Discord Employee',
    DISCORD_PARTNER: 'Discord Partner',
    BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
    BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
    HYPESQUAD_EVENTS: 'HypeSquad Events',
    HOUSE_BRAVERY: 'House of Bravery',
    HOUSE_BRILLIANCE: 'House of Brilliance',
    HOUSE_BALANCE: 'House of Balance',
    EARLY_SUPPORTER: 'Early Supporter',
    TEAM_USER: 'Team User',
    SYSTEM: 'System',
    VERIFIED_BOT: 'Verified Bot',
    VERIFIED_DEVELOPER: 'Verified Bot Developer'
};
const status = {
    dnd: 'Do Not Disturb',
    idle: 'Idle',
    online: 'Online',
    offline: 'Offline'
}

module.exports = class UserInfoCommand extends BaseCommand {
    constructor() {
        super('userInfo', {
            description: 'Display your information or another user\'s information if member is mentioned',
            usage: '!userInfo @<member>',
            example: '!userInfo **OR** !userInfo <@737182986939793551>',
            category: 'Information',
            aliases: []
        });
    }

    async run(client, message, args) {
        const member = message.mentions.members.last() || message.member;
        const roles = member.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(role => role.toString())
            .slice(0, -1);
        const userFlags = member.user.flags.toArray();
        const embed = new MessageEmbed()
            .setThumbnail(member.user.displayAvatarURL({
                dynamic: true,
                size: 512
            }))
            .setColor('DARK_RED')
            .addField('User', [
                `**❯ Username:** ${member.user.username}`,
                `**❯ Discriminator:** ${member.user.discriminator}`,
                `**❯ ID:** ${member.id}`,
                `**❯ Flags:** ${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'None'}`,
                `**❯ Avatar:** [Link to avatar](${member.user.displayAvatarURL({ dynamic: true })})`,
                `**❯ Time Created:** ${moment(member.user.createdTimestamp).format('LT')} ${moment(member.user.createdTimestamp).format('LL')} ${moment(member.user.createdTimestamp).fromNow()}`,
                `**❯ Status:** ${status[member.user.presence.status]}`,
                `**❯ Presence:** ${member.user.presence.activities || 'Not doing anything.'}`,
                `\u200b`
            ])
            .addField('Member', [
                `**❯ Highest Role:** ${member.roles.highest.id === message.guild.id ? 'None' : member.roles.highest.name}`,
                `**❯ Server Join Date:** ${moment(member.joinedAt).format('LL LTS')}`,
                `**❯ Hoist Role:** ${member.roles.hoist ? member.roles.hoist.name : 'None'}`,
                `**❯ Roles [${roles.length}]:** ${roles.length < 10 ? roles.join(', ') : roles.length > 10 ? this.client.utils.trimArray(roles) : 'None'}`,
                `\u200b`
            ]);
        return message.channel.send(embed);
    }
}
