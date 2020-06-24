export const getStartIntersectionString = (
  main: string, target: string,
): { str: string, isFull: boolean } => {
  if (target.indexOf(main) === 0) return { str: main, isFull: true };
  if (main[0] !== target[0]) return { str: '', isFull: false };
  let startIntersectionString = main[0];
  for (let i = 1, ln = main.length; i < ln; i += 1) {
    const character = main[i];
    if (character === target[i]) {
      startIntersectionString += character;
    } else {
      break;
    }
  }
  return { str: startIntersectionString, isFull: false };
};

export const escapeString = (str: string): string => str
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');
