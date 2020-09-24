const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class TrackStuckEvent extends BaseEvent {
    constructor() {
        super('trackStuck');
    }

    async run(client, player, track, message) {
        player.textChannel.send(`Error Playing ${track.title}`);
        console.log(`Error: ${message}`);
    }
}
