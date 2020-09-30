import {writable, get, Writable} from 'svelte/store';

class User {
    private static instance: User;
    public Info: Writable<unknown> = undefined;

    static getInstance() {
        if (!User.instance) User.instance = new User();
        return User.instance;
    }

    constructor() {
        this.Info = writable({});
    }

    set(value: unknown) {
        this.Info.set(value);
    }

    update(func: (value: unknown) => unknown) {
        this.Info.update(func)
    }

    get() {
        return get(this.Info);
    }

    subscribe(func: (value: unknown) => unknown) {
        this.Info.subscribe(func)
    }
}

export default User.getInstance();
