/* tslint:disable:no-empty */

import IPlugin from './IPlugin';
import ITermInfo from '@Term/ITermInfo';

class Plugin implements IPlugin {
  protected termInfo?: ITermInfo;

  public setTermInfo(termInfo: ITermInfo) {
    this.termInfo = termInfo;
  }

  public updateTermInfo(termInfo: ITermInfo) {
    this.termInfo = termInfo;
  }

  public destroy() {}
}

export default Plugin;
