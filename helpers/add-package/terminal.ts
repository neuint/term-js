import * as terminalKit from 'terminal-kit';

const { terminal: t } = terminalKit;

const getInputLine = (label: string): Promise<string> => new Promise((
  res: (val: string) => void, rej: (e: Error) => void,
) => {
  t(`${label} `);
  t.inputField((err: Error, val: string) => {
    t('\n');
    return err ? rej(err) : res(val);
  });
});

const getInputLinePack = (labels: string[], results: string[]): Promise<string[]> => {
  const label = labels.shift();
  if (!label) return Promise.resolve(results);
  return getInputLine(results.reduce((acc: string, val: string, index: number): string => {
    return acc.replace(`{{$${index}}}`, val);
  }, label)).then((val: string) => {
    results.push(val);
    return getInputLinePack(labels, results);
  });
};

export const getInput = (
  label: string | string[],
): Promise<string | string[]> => typeof label === 'string'
  ? getInputLine(label) : getInputLinePack(label, []);
