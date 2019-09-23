'use strict';
const ssq = require('../../js/utils/lib/ssq');
ssq.info('180.101.45.115', 27015, function (err, data) {
    if (!err) {
        console.log(data)
    }
});
ssq.players('180.101.45.115', 27015, function (err, data) {
    if (!err) {
        console.log(data)
    }
});
// ssq.rules('180.101.45.115', 27015, function (err, data) {
//     if (!err) {
//         console.log(data)
//     }else {
//         console.log(err)
//     }
// });