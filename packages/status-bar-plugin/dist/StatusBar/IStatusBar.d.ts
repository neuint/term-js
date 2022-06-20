import { IPlugin } from '@neuint/term-js';
export default interface IStatusBar extends IPlugin {
    status: {
        text: string;
        icon?: string;
    };
}
