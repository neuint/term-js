export const scrollbarSize = (container?: HTMLElement): number => {
  let { size } = scrollbarSize as { size?: number };
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
  (scrollbarSize as { size?: number }).size = size;
  return size;
};
