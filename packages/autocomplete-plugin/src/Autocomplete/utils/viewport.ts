export const getRelativePosition = (
  el: HTMLElement, container: HTMLElement,
): { top: number; bottom: number; left: number; right: number; width: number; height: number } => {
  const elInfo = el.getBoundingClientRect();
  const containerInfo = container.getBoundingClientRect();
  const left = elInfo.left - containerInfo.left;
  const top = elInfo.top - containerInfo.top;
  return {
    left,
    top,
    bottom: containerInfo.height - top - elInfo.height,
    right: containerInfo.width - left - elInfo.width,
    width: elInfo.width,
    height: elInfo.height,
  };
};
