const BaseCommand = require('../../utils/structures/BaseCommand');

const {
    MessageEmbed
} = require('discord.js');
const {
    Command
} = require('discord.js-commando');
const {
    utils
} = require('erela.js');

module.exports = class NowPlayingCommand extends BaseCommand {
    constructor() {
        super('nowPlaying', {
            description: 'Display the song currently playing',
            usage: '!nowPlaying',
            example: '!nowPlaying',
            category: 'Music',
            aliases: ['np']
        });
    }

    async run(client, message, args) {
        const guildId = message.guild.id;
        const player = client.music.players.get(guildId);

        const {
            channel
        } = message.member.voice;
        if (!(player && channel)) return;
        if (player.voiceChannel.id !== channel.id) return;

        const video = player.queue[0];
        let description = NowPlayingCommand.playbackBar(client, message, video);

        const videoEmbed = new MessageEmbed()
            .setTitle(`Now Playing 🎵`)
            .setThumbnail(video.displayThumbnail())
            .setColor('DARK_RED')
            .setDescription(`[${video.title}](${video.uri}) \n\n\`${description[0]}\` \n\n\`${description[1]}/${description[2]}\``)
            .addField(`Requested by`, video.requester.username);
        message.channel.send(videoEmbed);
        return;
    }

    static playbackBar(client, message, video) {
        const player = client.music.players.get(message.guild.id);
        const passedTimeInMS = player.position;
        const passedTimeInMSObj = {
            seconds: Math.floor((passedTimeInMS / 1000) % 60),
            minutes: Math.floor((passedTimeInMS / (1000 * 60)) % 60),
            hours: Math.floor((passedTimeInMS / (1000 * 60 * 60)) % 24)
        };
        const passedTimeFormatted = NowPlayingCommand.formatDuration(passedTimeInMSObj);

        const totalDurationinMS = video.duration;
        const totalDurationinMSObj = {
            seconds: Math.floor((totalDurationinMS / 1000) % 60),
            minutes: Math.floor((totalDurationinMS / (1000 * 60)) % 60),
            hours: Math.floor((totalDurationinMS / (1000 * 60 * 60)) % 24)
        };
        const totalDurationFormatted = NowPlayingCommand.formatDuration(totalDurationinMSObj);

        let totalDurationInMS = 0;
        Object.keys(totalDurationinMSObj).forEach(function (key) {
            if (key == 'hours') {
                totalDurationInMS = totalDurationInMS + totalDurationinMSObj[key] * 3600000;
            } else if (key == 'minutes') {
                totalDurationInMS = totalDurationInMS + totalDurationinMSObj[key] * 60000;
            } else if (key == 'seconds') {
                totalDurationInMS = totalDurationInMS + totalDurationinMSObj[key] * 100;
            }
        });
        const playBackBarLocation = Math.round(
            (passedTimeInMS / totalDurationInMS) * 10
        );
        let playBack = '';
        for (let i = 1; i < 30; i++) {
            if (playBackBarLocation == 0) {
                playBack = '🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬';
                break;
            } else if (playBackBarLocation == 30) {
                playBack = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘';
                break;
            } else if (i == playBackBarLocation * 3) {
                playBack = playBack + '🔘';
            } else {
                playBack = playBack + '▬';
            }
        }
        return [playBack, passedTimeFormatted, totalDurationFormatted];
    }

    static formatDuration(durationObj) {
        const duration = `${durationObj.hours ? (durationObj.hours + ':') : ''}${
            durationObj.minutes ? durationObj.minutes : '00'
          }:${
            (durationObj.seconds < 10)
              ? ('0' + durationObj.seconds)
              : (durationObj.seconds
              ? durationObj.seconds
              : '00')
          }`;
        return duration;
    }
}
