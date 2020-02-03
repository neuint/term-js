import { template as lodashTemplate, omit, isArray } from 'lodash-es';

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

class TemplateEngine implements ITemplateEngine {
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
      const condition = item.replace(/^<If\scondition="\{/, '').replace(/}">$/, '');
      return acc.replace(item, `<% if (${condition}) { %>`);
    }, template).replace(IF_CLOSE_PATTERN, '<% } %>');
  }

  private static getTemplateExecutorStringWithLodashSwitches(template: string): string {
    if (!CHOOSE_OPEN_PATTERN.test(template)) return template;
    const chooseList = template.match(CHOOSE_PATTERN) || [];
    return chooseList.reduce((acc: string, item) => {
      return this.getTemplateExecutorStringWithLodashWhen(
        acc, item.replace(/<Choose>[^<]*/, ''),
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
      const condition = openBlock.replace(/^<When\scondition="\{/, '').replace(/}">$/, '');
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

  private templateField: string = '';
  private templateExecutor?: (params: { [k: string]: any }) => string;
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

  protected refMap: { [name: string]: Element | undefined } = {};

  constructor(template?: string, container?: Element) {
    if (template) this.template = template;
    this.containerField = container || this.containerField;
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
    replace?: Element | Element[] | null,
  ) {
    const { container, template } = this;
    if (!container || !template) return;
    let replaceList: Element[] = [];
    if (replace) replaceList = isArray(replace) ? replace : [replace];
    this.insertRenderString(this.getRenderString(params), replaceList);
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

  private insertRenderString(renderString: string, replace: Element[]) {
    const container = this.container as Element;
    if (!container.innerHTML) return container.innerHTML = renderString;
    const proxyContainer = document.createElement('div');
    const { childNodes } = container;
    proxyContainer.innerHTML = renderString;
    proxyContainer.childNodes.forEach((childNode: ChildNode, index: number) => {
      const replaceItem = replace[index];
      const needReplace = replaceItem && Array.prototype.includes.call(childNodes, replaceItem);
      return needReplace
        ? container.replaceChild(childNode, replaceItem)
        : container.appendChild(childNode);
    });
  }
}

export default TemplateEngine;
