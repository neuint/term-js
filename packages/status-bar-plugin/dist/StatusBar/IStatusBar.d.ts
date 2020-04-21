import { IPlugin } from '@term-js/term';
export default interface IStatusBar extends IPlugin {
    status: {
        text: string;
        icon?: string;
    };
}
