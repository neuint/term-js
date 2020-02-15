import IAnimation from '@Term/Animation/IAnimation';

abstract class Animation implements IAnimation {
  private static animationFrame?: any;
  private static handlerList: (() => void)[] = [];
  private static activateRequestAnimationFrame() {
    if (!Animation.animationFrame) {
      Animation.animationFrame = window
        .requestAnimationFrame(Animation.requestAnimationFrameHandler);
    }
  }

  private static requestAnimationFrameHandler() {
    Animation.handlerList.forEach((handler: () => void) => handler());
    Animation.animationFrame = window
      .requestAnimationFrame(Animation.requestAnimationFrameHandler);
  }

  protected frameHandler?: () => void;

  protected constructor() {
    Animation.activateRequestAnimationFrame();
    if (this.frameHandler) this.addHandler();
  }

  public destroy() {
    this.removeHandler();
  }

  private addHandler() {
    const { frameHandler } = this;
    if (frameHandler) Animation.handlerList.push(frameHandler);
  }

  private removeHandler() {
    const { handlerList } = Animation;
    const { frameHandler } = this;
    if (frameHandler && handlerList.includes(frameHandler)) {
      const index = handlerList.indexOf(frameHandler);
      handlerList.splice(index, 1);
    }
  }
}

export default Animation;
