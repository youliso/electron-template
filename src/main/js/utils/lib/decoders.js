// Module imports
var pack = require('bufferpack');

// Creates a decoder that accepts a packet and either throws an
// error or returns the decoded data. Used to handle the common
// work that all decoders have to do, and then passes off
// to the supplied decode function
function make_decoder(type, decode) {
    return function (data, callback) {
        var values = pack.unpack('<i(header)c(type)', data);

        if (values === undefined) {
            callback(new Error('Packet isn\'t long enough'));
            return;
        }

        decode(data.slice(5), callback);
    };
}

module.exports = {
    info: make_decoder('m', function info_decoder(msg, callback) {
        let server_info = {};
        let index;
        // Get Map ip
        server_info.ip = msg.slice(0, index = msg.indexOf(0x00)).toString();
        msg = msg.slice(index + 1);
        // Get name
        server_info.name = msg.slice(0, index = msg.indexOf(0x00)).toString();
        msg = msg.slice(index + 1);
        // Get map
        server_info.map = msg.slice(0, index = msg.indexOf(0x00)).toString();
        msg = msg.slice(index + 1);
        // Get folder
        server_info.folder = msg.slice(0, index = msg.indexOf(0x00)).toString();
        msg = msg.slice(index + 1);
        // Get game
        server_info.game = msg.slice(0, index = msg.indexOf(0x00)).toString();
        msg = msg.slice(index + 1);
        // Number of players
        server_info.playerCount = msg.readInt8();
        msg = msg.slice(1);
        // Max players
        server_info.maxPlayers = msg.readInt8();
        msg = msg.slice(1);
        // Get Protocol
        server_info.Protocol = msg.readInt8();
        msg = msg.slice(1);
        // Get Server_type
        server_info.Server_type = msg.slice(0, 1).toString();
        msg = msg.slice(1);
        // Environment
        server_info.Environment = msg.slice(0, 1).toString();
        msg = msg.slice(1);
        // Visibility
        server_info.Visibility = msg.readInt8();
        msg = msg.slice(1);
        // Mod
        server_info.Mod = msg.readInt8();
        callback(null, server_info);
    }),

    players: make_decoder('D', function players_decoder(data, callback) {
        // Okay, we can probably read the first byte by ourselves:
        var player_cnt = data[0]
            , player, ch, str_len, rem
            , players = []
            , position = 1; // skip past the initial byte we read ourselves

        // Unfortunately, the bufferpack library doesn't support reading utf-8
        // strings (it assumes ASCII and doesn't have an option! wtf!), so we
        // have to do this manually... The only real solution would be to update
        // bufferpack (which hasn't been touched in a year) or switch libraries,
        // which I don't want to do at this point.
        while (position < data.length) {
            player = {
                index: 0,
                name: "",
                score: 0,
                duration: 0
            };

            // Read player index (1 byte)
            player.index = data[position++];

            // Find length of null-terminated player name:
            ch = data[position];
            str_len = 1;
            while (ch !== 0 && (position + str_len) < data.length) {
                ch = data[position + str_len];
                str_len++;
            }

            // TODO: Error checking if the message isn't properly terminated

            // Read string using proper native Buffer.toString, which support utf8
            // This could probably be combined with the above loop.
            player.name = data.toString('utf8', position, position + str_len - 1);
            position += str_len;

            // We can at least use pack.unpack at this point for the reamining values
            // so we don't have to handle the endianess ourselves.
            rem = pack.unpack('<l(score)f(duration)', data, position);
            player.score = rem.score;
            player.duration = rem.duration;
            position += 8;

            players.push(player);
        }

        /* players_cnt may not equal the number of players in the list if players
           are currently connecting to the server, so this is not an error.

        if (player_cnt != players.length) {
          callback(new Error('Did not receive the expected number of players.'
                                 + ' Expected: ' + player_cnt
                                 + ' But saw: '  + players.length));
        }
        */

        callback(null, players);
    }),

    rules: make_decoder('E', function rules_decoder(data, callback) {
        data = data.slice(20);
        //console.log(data.toString());
        let index,rules=[];
        while (true) {
            let rule={};
            rule.key = data.toString('utf8', 0, index = data.indexOf(0x00));
            data = data.slice(index + 1);
            rule.value = data.toString('utf8', 0, index = data.indexOf(0x00));
            data = data.slice(index + 1);
            //console.log(data);
            if(rule.key){
                rules.push(rule);
            }else {
                break;
            }
        }
        callback(null, rules);
    }),

    challenge: make_decoder('A', function challenge_decoder(data, callback) {
        // Don't bother parsing the challenge - just check its length.
        if (data.length !== 4) {
            callback(new Error('Challenge not 4 bytes'));
            return;
        }
        callback(null, data);
    })

};
