declare class ValueEvent {
    readonly value: string;
    readonly typedValue?: string;
    constructor(value: string, typedValue?: string);
}
export default ValueEvent;
