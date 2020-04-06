export const getKeyCode = (e: KeyboardEvent): number | null => e ? e.which || e.keyCode : null;
