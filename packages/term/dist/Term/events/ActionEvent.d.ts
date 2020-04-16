declare class ActionEvent {
    readonly action: string;
    readonly data?: any;
    readonly target?: HTMLElement | HTMLElement[] | {
        [key: string]: HTMLElement | HTMLElement[];
    };
    constructor(params: {
        action: string;
        data?: any;
        target?: HTMLElement | HTMLElement[] | {
            [key: string]: HTMLElement | HTMLElement[];
        };
    });
}
export default ActionEvent;
