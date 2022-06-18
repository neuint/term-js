class ValueEvent {
  public readonly value: string;

  public readonly typedValue?: string;

  constructor(value: string, typedValue?: string) {
    this.value = value;
    this.typedValue = typedValue;
  }
}

export default ValueEvent;
