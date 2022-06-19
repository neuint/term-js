import IAnimation from './IAnimation';
declare abstract class Animation implements IAnimation {
    private static animationFrame?;
    private static handlerList;
    private static activateRequestAnimationFrame;
    private static deactivateRequestAnimationFrame;
    private static requestAnimationFrameHandler;
    protected frameHandler?: () => void;
    protected constructor();
    destroy(): void;
    protected registerFrameHandler(): void;
    protected unregisterFrameHandler(): void;
    private addHandler;
    private removeHandler;
}
export default Animation;
