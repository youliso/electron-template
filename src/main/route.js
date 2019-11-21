module.exports = {
    pages: (Vue) => {
        const v = {
            "home": './views/home',
            "login": './views/login'
        };
        for (let key in v) Vue.component(key, require(v[key])[key]);
    }
};