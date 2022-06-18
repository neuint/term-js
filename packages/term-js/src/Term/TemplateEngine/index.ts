import { template as lodashTemplate, omit } from 'lodash-es';

import Animation from '../Animation';
import ITemplateEngine from './ITemplateEngine';
import {
  IF_CLOSE_PATTERN,
  IF_OPEN_PATTERN,
  REF_PATTERN,
  CHOOSE_OPEN_PATTERN,
  CHOOSE_PATTERN,
  CHOOSE_CLOSE_PATTERN,
  WHEN_PATTERN,
  OTHERWISE_PATTERN,
  WHEN_CLOSE_PATTERN,
  WHEN_OPEN_PATTERN,
  OTHERWISE_OPEN_PATTERN,
  OTHERWISE_CLOSE_PATTERN,
  CLASS_NAME_PATTERN,
} from './constants';

class TemplateEngine extends Animation implements ITemplateEngine {
  private static getProxyChildNodes(renderString: string): NodeListOf<ChildNode> | ChildNode[] {
    const proxyContainer = document.createElement('div');
    const proxyChildNodes: ChildNode[] = [];
    proxyContainer.innerHTML = renderString;
    const { childNodes } = proxyContainer;
    for (let i = 0, ln = childNodes.length; i < ln; i += 1) {
      proxyChildNodes.push(childNodes[i]);
    }
    return proxyChildNodes;
  }

  private static insertAfter(container: HTMLElement, element: HTMLElement, ref: HTMLElement) {
    const { childNodes } = container;
    const index = Array.prototype.indexOf.call(childNodes, ref);
    if (index < 0) return;
    if (index === childNodes.length - 1) {
      container.appendChild(element);
    } else {
      container.insertBefore(element, childNodes[index + 1]);
    }
  }

  private static getRenderStringWithClassNames(renderString: string, params: {
    css?: { [key: string]: string },
    [p: string]: string | number | boolean | undefined | { [key: string]: string },
  } = {}): string {
    const { css } = params;
    if (!css) return renderString;
    const classNameStringList = renderString.match(CLASS_NAME_PATTERN);
    if (!classNameStringList) return renderString;
    return classNameStringList.reduce((acc: string, classNameString: string): string => {
      const classNameList = classNameString.replace('class="', '').replace('"', '').split(' ');
      const replacedClassNameList = classNameList
        .map((item: string): string => css[item] || item).join(' ');
      const pattern = new RegExp(`class="${classNameList.join('\\s')}"`);
      return acc.replace(pattern, `class="${replacedClassNameList}"`);
    }, renderString);
  }

  private static getRenderStringWithVariables(renderString: string, params: {
    css?: { [key: string]: string },
    [p: string]: string | number | boolean | undefined | { [key: string]: string },
  } = {}): string {
    // eslint-disable-next-line no-param-reassign
    delete params.css;
    return Object.keys(params).reduce((acc: string, key: string): string => {
      const pattern = new RegExp(`\\{${key}}`, 'g');
      return acc.replace(pattern, params[key] as string);
    }, renderString);
  }

  private static getTemplateExecutor(template: string): (params: { [k: string]: any }) => string {
    let processedTemplate = TemplateEngine
      .getTemplateExecutorStringWithLodashConditions(template);
    processedTemplate = TemplateEngine
      .getTemplateExecutorStringWithLodashSwitches(processedTemplate)
      .replace(/\s*%>[\s\n]*<%\s*/g, ' ');
    return lodashTemplate(processedTemplate);
  }

  private static getTemplateExecutorStringWithLodashConditions(template: string): string {
    const conditionList = template.match(IF_OPEN_PATTERN);
    if (!conditionList) return template;
    return conditionList.reduce((acc: string, item: string) => {
      const condition = item.replace(/^<If\scondition="\{/i, '').replace(/}">$/, '');
      return acc.replace(item, `<% if (${condition}) { %>`);
    }, template).replace(IF_CLOSE_PATTERN, '<% } %>');
  }

  private static getTemplateExecutorStringWithLodashSwitches(template: string): string {
    if (!CHOOSE_OPEN_PATTERN.test(template)) return template;
    const chooseList = template.match(CHOOSE_PATTERN) || [];
    return chooseList.reduce((acc: string, item) => {
      return this.getTemplateExecutorStringWithLodashWhen(
        acc, item.replace(/<Choose>[^<]*/i, ''),
      );
    }, template).replace(CHOOSE_OPEN_PATTERN, '').replace(CHOOSE_CLOSE_PATTERN, '');
  }

  private static getTemplateExecutorStringWithLodashWhen(
    template: string, data: string,
  ): string {
    const whenList = data.match(WHEN_PATTERN) || [];
    const otherwiseList = data.match(OTHERWISE_PATTERN) || [];
    const processedString = whenList.reduce((acc: string, item, index) => {
      const openBlockList = item.match(WHEN_OPEN_PATTERN);
      if (!openBlockList) return acc;
      const openBlock = openBlockList[0];
      const condition = openBlock.replace(/^<When\scondition="\{/i, '').replace(/}">$/, '');
      const processedBlock = item.replace(openBlock, `<%${index ? ' else' : ''} if (${condition}) { %>`);
      return acc.replace(item, processedBlock);
    }, template).replace(WHEN_CLOSE_PATTERN, '<% } %>');
    return otherwiseList.length === 1
      ? otherwiseList.reduce((acc, item) => {
        const processedBlock = item
          .replace(OTHERWISE_OPEN_PATTERN, whenList.length ? '<% else {  %>' : '');
        return acc.replace(item, processedBlock);
      }, processedString).replace(OTHERWISE_CLOSE_PATTERN, whenList.length ? '<% } %>' : '')
      : processedString;
  }

  private childNodesField?: NodeListOf<ChildNode> | ChildNode[] = [];

  private get childNodes(): NodeListOf<ChildNode> | ChildNode[] | undefined {
    return this.childNodesField;
  }

  private set childNodes(value: NodeListOf<ChildNode> | ChildNode[] | undefined) {
    this.childNodesField = value;
  }

  public get nodeList(): NodeListOf<ChildNode> | ChildNode[] {
    return this.childNodes || [];
  }

  private templateField = '';

  private templateExecutor?: (params: { [k: string]: any }) => string;

  protected isHidden = false;

  public get template(): string {
    return this.templateField;
  }

  public set template(value: string) {
    this.templateExecutor = TemplateEngine.getTemplateExecutor(value);
    this.templateField = value;
  }

  private containerField?: Element;

  public get container(): Element | undefined {
    return this.containerField;
  }

  public set container(value: Element | undefined) {
    this.containerField = value;
  }

  constructor(template?: string, container?: Element) {
    super();
    if (template) this.template = template;
    this.containerField = container || this.containerField;
  }

  public destroy() {
    super.destroy();
    const { container, childNodes } = this;
    childNodes?.forEach((childNode: ChildNode) => {
      container?.removeChild(childNode);
    });
  }

  protected refMap: { [name: string]: Element | undefined } = {};

  public show(append = true, ref?: ITemplateEngine | undefined) {
    if (!this.isHidden) return;
    this.isHidden = false;
    const { container, childNodes } = this;
    if (!container || !childNodes) return;
    if (ref) {
      this.addChildNodesWithRef(append, ref);
    } else {
      this.addChildNodesWithoutRef(append);
    }
  }

  public hide() {
    if (this.isHidden) return;
    this.isHidden = true;
    const { container, childNodes } = this;
    if (container && childNodes) {
      childNodes.forEach((childNode: ChildNode) => {
        if (this.checkChildExists(childNode)) container.removeChild(childNode);
      });
    }
  }

  public getRefMap(): { [name: string]: Element | undefined } {
    return { ...this.refMap };
  }

  public getRef(name: string): Element | undefined {
    return this.refMap[name];
  }

  public render(
    params?: {
      css?: { [key: string]: string },
      [p: string]: string | number | boolean | undefined | { [key: string]: string },
    },
    options?: {
      replace?: ITemplateEngine,
      ref?: ITemplateEngine,
      append?: boolean,
    },
  ) {
    const { container, template } = this;
    if (!container || !template) return;
    this.insertRenderString(this.getRenderString(params), options || {});
    this.saveRefs();
  }

  protected getRenderString(params?: {
    css?: { [key: string]: string },
    [p: string]: string | number | boolean | undefined | { [key: string]: string },
  }): string {
    const { templateExecutor } = this;
    if (!templateExecutor) return '';
    let renderString = templateExecutor(omit(params, ['css']) as { [k: string]: any });
    renderString = TemplateEngine.getRenderStringWithClassNames(renderString, params);
    return TemplateEngine.getRenderStringWithVariables(renderString, params);
  }

  private saveRefs() {
    const { container } = this;
    const refs = this.template.match(REF_PATTERN);
    this.refMap = refs ? refs.reduce((
      acc: { [name: string]: Element | undefined }, item: string,
    ): { [name: string]: Element | undefined } => {
      const name = item.replace(/^ref="/, '').replace(/"$/, '');
      if (!name) return acc;
      const element = container?.querySelector(`[ref="${name}"]`);
      if (!element) return acc;
      element.removeAttribute('ref');
      acc[name] = element;
      return acc;
    }, {}) : {};
  }

  private insertRenderString(
    renderString: string,
    options: {
      replace?: ITemplateEngine,
      ref?: ITemplateEngine,
      append?: boolean,
    },
  ) {
    const { replace, append = true, ref } = options;
    if (replace) return this.replaceRenderString(renderString, replace);
    if (ref) return this.addRenderStringWithRef(append, renderString, ref);
    return this.addRenderStringWithoutRef(append, renderString);
  }

  private replaceRenderString(renderString: string, replace: ITemplateEngine) {
    const container = this.container as Element;
    const { childNodes } = container;
    const proxyChildNodes = TemplateEngine.getProxyChildNodes(renderString);
    const replaceNodeList = replace.nodeList;
    if (!replaceNodeList || replaceNodeList.length !== proxyChildNodes.length) return;
    proxyChildNodes.forEach((childNode: ChildNode, index: number) => {
      const replaceItem = replaceNodeList[index];
      if (replaceItem && Array.prototype.includes.call(childNodes, replaceItem)) {
        container.replaceChild(childNode, replaceItem);
      }
    });
    this.childNodes = proxyChildNodes;
  }

  private addRenderStringWithoutRef(append: boolean, renderString: string) {
    this.childNodes = TemplateEngine.getProxyChildNodes(renderString);
    this.addChildNodesWithoutRef(append);
  }

  private addChildNodesWithoutRef(append: boolean) {
    const container = this.container as Element;
    const childNodes = this.childNodes as ChildNode[];
    const firstChild = container.firstChild as HTMLElement;
    childNodes.forEach((childNode: ChildNode) => {
      if (append) {
        this.appendChild(childNode);
      } else {
        this.insertBefore(childNode, firstChild);
      }
    });
    this.childNodes = childNodes;
  }

  private addRenderStringWithRef(append: boolean, renderString: string, ref: ITemplateEngine) {
    this.childNodes = TemplateEngine.getProxyChildNodes(renderString);
    this.addChildNodesWithRef(append, ref);
  }

  private addChildNodesWithRef(append: boolean, ref: ITemplateEngine) {
    const childNodes = this.childNodes as ChildNode[];
    const refNodeList = ref.nodeList;
    if (!refNodeList?.length) return;
    const refNode = (append ? refNodeList[refNodeList.length - 1] : refNodeList[0]) as HTMLElement;
    (append ? Array.prototype.reverse.call(childNodes) : childNodes)
      .forEach((childNode: ChildNode, index: number) => {
        if (append) {
          return index
            ? this.insertBefore(childNode, childNodes[0])
            : this.insertAfter(childNode, refNode);
        }
        return this.insertBefore(childNode, refNode);
      });
  }

  private checkChildExists(childNode: ChildNode): boolean {
    const { container } = this;
    if (container) {
      const containerChildNodes = container.childNodes;
      return Array.prototype.includes.call(containerChildNodes, childNode);
    }
    return false;
  }

  private insertBefore(childNode: ChildNode, ref: ChildNode) {
    const { container } = this;
    if (container && this.checkChildExists(ref)) {
      container.insertBefore(childNode, ref);
    }
  }

  private insertAfter(childNode: ChildNode, ref: ChildNode) {
    const { container } = this;
    if (container && this.checkChildExists(ref)) {
      TemplateEngine
        .insertAfter(container as HTMLElement, childNode as HTMLElement, ref as HTMLElement);
    }
  }

  private appendChild(childNode: ChildNode) {
    const { container } = this;
    if (container) container.appendChild(childNode);
  }
}

export default TemplateEngine;
