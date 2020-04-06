import ITermInfo from '@Term/ITermInfo';

export default interface IPlugin {
  setTermInfo(termInfo: ITermInfo): void;
  updateTermInfo(termInfo: ITermInfo): void;
  destroy(): void;
}
