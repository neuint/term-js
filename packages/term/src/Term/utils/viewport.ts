import { SizeType } from '@Term/types';
import { NON_BREAKING_SPACE } from '@Term/constants/strings';

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
