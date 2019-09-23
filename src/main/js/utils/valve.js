'use strict';
const dgram = require('dgram');
const client = dgram.createSocket('udp4');

const header = Buffer.from([0xFF,0xFF,0xFF,0xFF,0x54]);
const payload = Buffer.from("Source Engine Query");
const suffix = Buffer.from([0x00]);
const message = Buffer.concat([header, payload, suffix], header.length + payload.length + suffix.length);

client.on("message", function (msg, info) {
    // Skip prefix(4), header(1), protocol(1) (4 + 1 + 1)
    msg = msg.slice(5);
    let index;
    // Get Map ip
    let ip = msg.slice(0, index = msg.indexOf(0x00)).toString();
    msg = msg.slice(index+1);
    // Get name
    let name = msg.slice(0, index = msg.indexOf(0x00)).toString();
    msg = msg.slice(index+1);
    // Get map
    let map = msg.slice(0, index = msg.indexOf(0x00)).toString();
    msg = msg.slice(index+1);
    // Get folder
    let folder = msg.slice(0, index = msg.indexOf(0x00)).toString();
    msg = msg.slice(index+1);
    // Get game
    let game = msg.slice(0, index = msg.indexOf(0x00)).toString();
    msg = msg.slice(index+1);
    // Number of players
    let playerCount = msg.readInt8();
    msg = msg.slice(1);
    // Max players
    let maxPlayers = msg.readInt8();
    msg = msg.slice(1);
    // Get Protocol
    let Protocol = msg.readInt8();
    msg = msg.slice(1);
    // Get Server_type
    let Server_type = msg.slice(0, 1).toString();
    msg = msg.slice(1);
    // Environment
    let Environment = msg.slice(0, 1).toString();
    msg = msg.slice(1);
    // Visibility
    let Visibility = msg.readInt8();
    msg = msg.slice(1);
    // Mod
    let Mod = msg.readInt8();

    console.log('ip: ' + ip);
    console.log('name: ' + name);
    console.log('map: ' + map);
    console.log('folder: ' + folder);
    console.log('game: ' + game);
    console.log('playerCount: ' + playerCount);
    console.log('maxPlayers: ' + maxPlayers);
    console.log('Protocol: ' + Protocol);
    console.log('Server_type: ' + Server_type);
    console.log('Environment: ' + Environment);
    console.log('Visibility: ' + Visibility);
    console.log('Mod: ' + Mod);
    client.close();
});

client.send(message,27015, '180.101.45.115',(err) => {
    if (err) {
        console.log(err);
        client.close();
    } else {
        console.log("sent");
    }
});