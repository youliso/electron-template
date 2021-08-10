export class Store {
  private static instance: Store;

  public sharedObject: { [key: string]: any } = {};

  static getInstance() {
    if (!Store.instance) Store.instance = new Store();
    return Store.instance;
  }

  constructor() {}

}

export default Store.getInstance();
