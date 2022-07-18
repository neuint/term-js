import { IPlugin } from '@neuint/term-js';

export default interface ICommandSearch extends IPlugin {
  autoOpen: boolean;
  commands: string[];
}
