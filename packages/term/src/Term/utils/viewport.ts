import { SizeType } from '@Term/types';
import { NON_BREAKING_SPACE } from '@Term/constants/strings';
import { TEXT_NODE_TYPE } from '@Term/constants/viewport';
import { NON_BREAKING_SPACE_PATTERN } from '@Term/constants/patterns';

export const getItemSize = (() => {
  const cache = new Map<HTMLElement, HTMLElement>();

  const addElement = (target: HTMLElement): HTMLElement => {
    const cacheTextContainer = cache.get(target);
    if (cacheTextContainer) return cacheTextContainer;
    const textContainer = document.createElement('span');
    textContainer.innerHTML = NON_BREAKING_SPACE;
    textContainer.style.position = 'absolute';
    textContainer.style.left = '0';
    textContainer.style.top = '0';
    textContainer.style.visibility = 'hidden';
    textContainer.style.pointerEvents = 'none';
    textContainer.style.userSelect = 'none';
    target.appendChild(textContainer);
    return textContainer;
  };

  return (container?: HTMLElement, save: boolean = false): SizeType => {
    const target = container || document.body;
    const textContainer = addElement(target);
    const size = { width: textContainer.offsetWidth, height: textContainer.offsetHeight };
    if (container && save) {
      if (!cache.has(target)) cache.set(target, textContainer);
      return size;
    }
    cache.delete(target);
    target.removeChild(textContainer);
    return size;
  };
})();

export const checkElementFocus = (el: HTMLElement): boolean => {
  const { activeElement } = document;
  return activeElement === el
    || activeElement?.parentNode === el
    || activeElement?.parentNode === el;
};

export const compareItemSize = (first: SizeType, second: SizeType): boolean => {
  return first.width === second.width && first.height === second.height;
};

export const getLastTextNode = (root: HTMLElement): Node | null => {
  const { lastChild } = root;
  if (!lastChild) return null;
  if (lastChild.nodeType === TEXT_NODE_TYPE) return lastChild;
  return getLastTextNode(lastChild as HTMLElement);
};

export const moveContentEditableCaretToEnd = (el: HTMLElement, autoFocus: boolean = false) => {
  const isNotFocused = !checkElementFocus(el);
  if (isNotFocused && !autoFocus) return;
  if (isNotFocused) el.focus();
  const range = document.createRange();
  const selection = window.getSelection();
  const node = getLastTextNode(el);
  if (!node) return;
  range.selectNodeContents(node);
  range.collapse(false);
  if (selection) {
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

export const getHtmlStringifyValue = (html: string): string => {
  return html.replace(NON_BREAKING_SPACE_PATTERN, ' ');
};

export const getNodeOffset = (
  root: HTMLElement, target: HTMLElement | Node, baseOffset: number = 0,
): number => {
  const { parentNode } = target;
  if (!parentNode || root === target) return 0;
  let isFound = false;
  const prevNodes = Array.prototype.filter.call(parentNode.childNodes, (
    childNode: HTMLElement | Node,
  ): boolean => {
    const isTarget = childNode === target;
    if (isTarget && !isFound) isFound = true;
    return !isTarget && !isFound;
  });
  const offset = prevNodes.reduce((acc: number, node: HTMLElement | Node): number => {
    const value = node.nodeType === TEXT_NODE_TYPE
      ? node.nodeValue
      : getHtmlStringifyValue((node as HTMLElement).innerHTML);
    return acc + (value ? value.length : 0);
  }, 0);
  return root === parentNode
    ? baseOffset + offset
    : getNodeOffset(root, parentNode, baseOffset + offset);
};

export const checkChildNode = (root: HTMLElement, checkNode: HTMLElement | Node): boolean => {
  if (root === checkNode) return true;
  const { parentNode } = checkNode;
  return parentNode ? checkChildNode(root, parentNode) : false;
};

export const getContentEditableCaretPosition = (el: HTMLElement): number => {
  const selection = window.getSelection();
  if (!selection || !selection.isCollapsed || !selection.anchorNode) return -1;
  const anchorNode = (selection.anchorNode === el
    ? getLastTextNode(el) : selection.anchorNode) as Node;
  if (selection.anchorNode === el && !anchorNode) return 0;
  if (!anchorNode || !checkChildNode(el, anchorNode)) return -1;
  return getNodeOffset(
    el,
    anchorNode,
    anchorNode.nodeType === TEXT_NODE_TYPE ? selection.anchorOffset : 0,
  );
};

export const setContentEditableCaretPosition = (el: HTMLElement, position: number) => {
  let offset = 0;
  let relativeOffset = 0;
  const targetNode = Array.prototype.find.call(el.childNodes, (
    childNode: HTMLElement | Node,
  ): boolean => {
    const length = ((childNode.nodeType === TEXT_NODE_TYPE
      ? childNode.nodeValue
      : getHtmlStringifyValue((childNode as HTMLElement).innerHTML)) || '')
      .length;
    relativeOffset = offset;
    offset += length;
    return position <= offset;
  });
  const selection = window.getSelection();
  if (!selection || !targetNode) return;
  const range = new Range();
  const targetChildNode = targetNode.nodeType === TEXT_NODE_TYPE
    ? targetNode : targetNode.firstChild;
  range.setStart(targetChildNode, position - relativeOffset);
  range.setEnd(targetChildNode, position - relativeOffset);
  selection.removeAllRanges();
  selection.addRange(range);
};
