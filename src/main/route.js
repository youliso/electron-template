module.exports = {
    pages: (Vue) => {
        const fs = require('fs');
        let o = '';
        fs.readdirSync(__dirname + '/views').forEach((view) => {
            let v = require(__dirname + '/views/' + view);
            if (o == '') o = v.main.data().only;
            if (v.main) Vue.component(v.main.data().only, v.main);
        });
        return o;
    }
};