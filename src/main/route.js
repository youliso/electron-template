module.exports = {
    pages: (Vue) => {
        const v = {
            "home": require('./pages/home').home,
            "login": require('./pages/login').login
        };
        for (let key in v) Vue.component(key, v[key]);
    }
};