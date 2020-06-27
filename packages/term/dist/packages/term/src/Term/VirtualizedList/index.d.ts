import IVirtualizedList from '@Term/VirtualizedList/IVirtualizedList';
import TemplateEngine from '@Term/TemplateEngine';
import IVirtualizedItem from '@Term/VirtualizedList/IVirtualizedItem';
declare class VirtualizedList<T extends IVirtualizedItem<any>> extends TemplateEngine implements IVirtualizedList<T> {
    private lengthValue;
    set length(value: number);
    get length(): number;
    private scrollTimeout?;
    private itemGetter;
    private heightGetter;
    private height;
    private readonly topOffset;
    private readonly bottomOffset;
    private itemsCache;
    private viewportItems;
    private renderedItems;
    private offset;
    private restoreParams;
    private static checkFullViewportItem;
    private static checkViewportItem;
    constructor(container: Element, params: {
        length: number;
        itemGetter: (index: number, params?: {
            container?: HTMLElement;
            ref?: T;
            append?: boolean;
        }) => T | null;
        heightGetter: (index: number) => number;
        topOffset?: number;
        bottomOffset?: number;
        className?: string;
    });
    scrollBottom(): void;
    destroy(): void;
    getGeneralItemsContainer(): Element | undefined;
    getVirtualItemsContainer(): Element | undefined;
    render(params?: {
        css?: {
            [p: string]: string;
        };
        [p: string]: string | number | boolean | {
            [p: string]: string;
        } | undefined;
    }): void;
    updateViewport(): void;
    clearCache(): void;
    private updateHeight;
    private renderViewportItems;
    private renderItems;
    private renderItem;
    private removeStartItems;
    private removeEndItems;
    private removeAllItems;
    private removeItem;
    private restoreScrollTop;
    private updateScrollTop;
    private updateRestoreParams;
}
export default VirtualizedList;
