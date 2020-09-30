import {writable, get, Writable} from 'svelte/store';

class User {
    private static instance: User;
    public Info: { [key: string]: Writable<unknown> } = {};

    static getInstance() {
        if (!User.instance) User.instance = new User();
        return User.instance;
    }

    constructor() {
        this.Info.count = writable(0);
    }

    get(key: string) {
        return get(this.Info[key]);
    }
}

export default User.getInstance();
