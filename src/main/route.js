module.exports = {
    pages: (Vue) => {
        const v = {
            "home": require('./views/home').home,
            "login": require('./views/login').login
        };
        for (let key in v) Vue.component(key, v[key]);
    }
};