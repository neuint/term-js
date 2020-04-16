export default interface ITemplateEngine {
    template: string;
    container?: Element;
    nodeList?: NodeListOf<ChildNode> | ChildNode[];
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
    getRefMap(): {
        [name: string]: Element | undefined;
    };
    getRef(name: string): Element | undefined;
    destroy(): void;
    show(append?: boolean, ref?: ITemplateEngine): void;
    hide(): void;
}
