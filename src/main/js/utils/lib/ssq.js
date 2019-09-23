/* Source Server Query (SSQ) library
 * Author : George Pittarelli
 *
 * SSQ protocol is specified here:
 * https://developer.valvesoftware.com/wiki/Server_queries
 */

// Module imports
var dgram = require('dgram')
  , pack = require('bufferpack')
  , decoders = require('./decoders.js'),RULESNum = 0,RULESdata;

// Message request formats, straight from the spec
// Note: A2A_PING has been deprecated, and the GETCHALLENGE has been replaced
//       by sending the method you want a challenge for with a 0xffffffff (-1)
//       challenge number, which gives back a challenge that then works.
var A2A_PING = new Buffer("i") // note PING is deprecated
  , A2S_SERVERQUERY_GETCHALLENGE = new Buffer([0xff, 0xff, 0xff, 0xff, 0x55])
  , A2S_INFO = new Buffer([0xFF, 0xFF, 0xFF, 0xFF, 0x54, 0x53, 0x6F, 0x75, 0x72,
                         0x63, 0x65, 0x20, 0x45, 0x6E, 0x67, 0x69, 0x6E, 0x65,
                         0x20, 0x51, 0x75, 0x65, 0x72, 0x79, 0x00])
  // The following messages require challenge values to be appended to them
  , A2S_PLAYER = new Buffer([0xff, 0xff, 0xff, 0xff, 0x55])
  , A2S_RULES = new Buffer([ 0xFF,  0xFF,  0xFF, 0xFF, 0x56]);

// -1 buffer for appending to buffers which require challenges
var NEG_1_BUFFER = new Buffer([0xff, 0xff, 0xff, 0xff]);

//var get_challenge = adf;

function ssq_request(server, port, request,
                       decoder, callback, needs_challenge) {
  var socket = dgram.createSocket('udp4')
    , combined_len, combined_request;
  callback = callback || function (){};

  function receive_data(data) {
    if(A2S_RULES == request){
      RULESNum++;
      if(RULESNum == 2){
        data = data.slice(9);
        let outdata = Buffer.concat([RULESdata,data]);
        socket.close();
        decoder(outdata, callback);
      }else {
        RULESdata = Buffer.from(data);
      }
    }else {
      socket.close();
      decoder(data, callback);
    }
  }

  function receive_challenge(data) {
    decoders.challenge(data, function (err, challenge) {
      if (err) {
        callback(err);
        return;
      }

      // combine challenge with request that requires a challenge
      challenge.copy(combined_request, request.length);
      if(A2S_RULES == request){
        socket.on('message', receive_data);
      }else {
        socket.once('message', receive_data);
      }

      socket.send(combined_request, 0, combined_len,
          port, server, error_handler);
    });
  }

  function error_handler(err, bytes) {
    if (err) {
      callback(err);
    }
  }

  if (needs_challenge) {
    socket.once('message', receive_challenge);

    combined_len = request.length + 4;
    combined_request = Buffer.concat([request, NEG_1_BUFFER]);

    socket.send(combined_request, 0, combined_len,
                port, server, error_handler);
  } else {
    socket.once('message', receive_data);
    socket.send(request, 0, request.length, port, server, error_handler);
  }
}

// Factory to make the methods we are exporting:
function make_request_method(request, decoder, needs_challenge) {
  return function (server, port, callback) {
    ssq_request(server, port, request, decoder, callback, needs_challenge);
  };
}

module.exports = {
  ping: make_request_method(A2A_PING)
, info: make_request_method(A2S_INFO, decoders.info)
, players: make_request_method(A2S_PLAYER, decoders.players, true)
, rules: make_request_method(A2S_RULES, decoders.rules, true)

// Exported for completeness (as in, having a function for every request type
// listed on the SSQ wiki page). Probably won't have any use.
, get_challenge: make_request_method(A2S_SERVERQUERY_GETCHALLENGE,
                                     decoders.challenge)
};
