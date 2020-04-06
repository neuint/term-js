import { memoize } from 'lodash-es';

import { SizeType } from '@Term/types';
import { NON_BREAKING_SPACE } from '@Term/constants/strings';

export const getScrollbarSize = (container?: HTMLElement): number => {
  let { size } = getScrollbarSize as { size?: number };
  if (size) return size;
  const target = container || document.body;
  const div1: HTMLDivElement = document.createElement('div');
  const div2: HTMLDivElement = document.createElement('div');
  div1.style.width = '100px';
  div1.style.height = '100px';
  div1.style.overflow = 'scroll';
  div2.style.height = '100px';
  target.appendChild(div1);
  div1.appendChild(div2);
  size = div1.offsetWidth - div2.offsetWidth;
  target.removeChild(div1);
  (getScrollbarSize as { size?: number }).size = size;
  return size;
};

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

export const compareItemSize = (first: SizeType, second: SizeType): boolean => {
  return first.width === second.width && first.height === second.height;
};
