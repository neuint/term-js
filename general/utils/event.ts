export const getKeyCode = (e: KeyboardEvent): number | null => e ? e.which || e.keyCode : null;
export const stopPropagation = (e: Event) => e.stopPropagation();
export const preventDefault = (e: Event) => e.preventDefault();
export const preventContextMenu = (e: MouseEvent): boolean => {
  if (e.shiftKey) return false;
  preventDefault(e);
  return true;
};
