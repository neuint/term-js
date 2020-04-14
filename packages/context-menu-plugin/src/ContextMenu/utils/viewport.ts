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

export const getRelativePosition = (
  el: HTMLElement, container: HTMLElement,
): { top: number; bottom: number; left: number; right: number; width: number; height: number } => {
  const scrollBarSize = getScrollbarSize(container);
  const elInfo = el.getBoundingClientRect();
  const containerInfo = container.getBoundingClientRect();
  const left = elInfo.left - containerInfo.left;
  const top = elInfo.top - containerInfo.top;
  const containerWidth = containerInfo.width - scrollBarSize;
  const containerHeight = containerInfo.height - scrollBarSize;
  return {
    left,
    top,
    bottom: containerHeight - top - elInfo.height,
    right: containerWidth - left - elInfo.width,
    width: elInfo.width,
    height: elInfo.height,
  };
};
