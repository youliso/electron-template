class CustomizeData {
  private static instance: CustomizeData;

  public data: Customize;

  static getInstance() {
    if (!CustomizeData.instance) CustomizeData.instance = new CustomizeData();
    return CustomizeData.instance;
  }

  constructor() {}

  set(data: Customize) {
    this.data = data;
  }

  get() {
    return this.data;
  }
}

export default CustomizeData.getInstance();
