import Animation from '../Animation';
import ITemplateEngine from './ITemplateEngine';
declare class TemplateEngine extends Animation implements ITemplateEngine {
    private static getProxyChildNodes;
    private static insertAfter;
    private static getRenderStringWithClassNames;
    private static getRenderStringWithVariables;
    private static getTemplateExecutor;
    private static getTemplateExecutorStringWithLodashConditions;
    private static getTemplateExecutorStringWithLodashSwitches;
    private static getTemplateExecutorStringWithLodashWhen;
    private childNodesField?;
    private get childNodes();
    private set childNodes(value);
    get nodeList(): NodeListOf<ChildNode> | ChildNode[];
    private templateField;
    private templateExecutor?;
    protected isHidden: boolean;
    get template(): string;
    set template(value: string);
    private containerField?;
    get container(): Element | undefined;
    set container(value: Element | undefined);
    constructor(template?: string, container?: Element);
    destroy(): void;
    protected refMap: {
        [name: string]: Element | undefined;
    };
    show(append?: boolean, ref?: ITemplateEngine | undefined): void;
    hide(): void;
    getRefMap(): {
        [name: string]: Element | undefined;
    };
    getRef(name: string): Element | undefined;
    render(params?: {
        css?: {
            [key: string]: string;
        };
        [p: string]: string | number | boolean | undefined | {
            [key: string]: string;
        };
    }, options?: {
        replace?: ITemplateEngine;
        ref?: ITemplateEngine;
        append?: boolean;
    }): void;
    protected getRenderString(params?: {
        css?: {
            [key: string]: string;
        };
        [p: string]: string | number | boolean | undefined | {
            [key: string]: string;
        };
    }): string;
    private saveRefs;
    private insertRenderString;
    private replaceRenderString;
    private addRenderStringWithoutRef;
    private addChildNodesWithoutRef;
    private addRenderStringWithRef;
    private addChildNodesWithRef;
    private checkChildExists;
    private insertBefore;
    private insertAfter;
    private appendChild;
}
export default TemplateEngine;
