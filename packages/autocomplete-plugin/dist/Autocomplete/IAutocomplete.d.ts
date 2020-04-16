import { IPlugin } from '@term-js/term';
export default interface IAutocomplete extends IPlugin {
    commands: string[];
    addCommand(command: string): void;
    removeCommand(command: string): void;
}
