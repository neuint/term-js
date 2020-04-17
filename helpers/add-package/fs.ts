import { stat, Stats, mkdir, readFile, writeFile, copyFile } from 'fs';
import { EXISTS_ERROR, NOT_FOUND_ERROR } from './constants';

export const checkExists = (targetPath: string): Promise<boolean> => new Promise((
  res: (result: boolean) => void, rej: (e: Error) => void,
) => {
  stat(targetPath, (err: NodeJS.ErrnoException | null, stats: Stats) => {
    if (err && err.code === 'ENOENT') return res(false);
    if (err) return rej(err);
    res(true);
  });
});

export const read = (
  filePath: string, encoding?: string,
): Promise<string | Buffer> => checkExists(filePath).then((exists: boolean) => new Promise((
  res: (data: string | Buffer) => void, rej: (err: Error) => void,
) => {
  const callback = <T extends string | Buffer>(err: Error, data: T) => {
    if (err) return rej(err);
    res(data);
  };
  if (encoding) {
    readFile(filePath, encoding, callback);
  } else {
    readFile(filePath, callback);
  }
}));

export const appendText = (
  filePath: string, text: string, after?: string,
): Promise<undefined> => read(filePath, 'utf-8').then((data: string): Promise<undefined> => {
  return new Promise((res: () => void, rej: (e: Error) => void) => {
    if (after && !data.includes(data)) return rej(new Error(NOT_FOUND_ERROR));
    const updatedText = after ? data.replace(after, `${after}${text}`) : `${data}${after}`;
    writeFile(filePath, updatedText, 'utf-8', err => err ? rej(err) : res());
  });
});

export const mkDir = (
  dirPath: string, skipExistsError?: boolean,
): Promise<undefined> => checkExists(dirPath)
  .then((exists: boolean) => new Promise((res: () => void, rej: (e: Error) => void) => {
    if (exists) return skipExistsError ? res() : rej(new Error(EXISTS_ERROR));
    mkdir(dirPath, err => err ? rej(err) : res());
  }));

export const mkDirPack = (list: string[]): Promise<undefined> => {
  const item = list.shift();
  if (!item) return Promise.resolve(undefined);
  return mkDir(item, true).then(() => mkDirPack(list));
};

export const mkPathDirs = (targetPath: string): Promise<undefined> => {
  const list = targetPath.replace(/^\//, '').split('/');
  list.pop();
  if (!list.length) return Promise.resolve(undefined);
  list[0] = `/${list[0]}`;
  return mkDirPack(list.reduce((acc: string[], item: string): string[] => {
    acc.push(acc.length ? [acc[acc.length - 1], item].join('/') : item);
    return acc;
  }, []));
};

export const copy = <T extends string | Buffer>(
  from: string, to: string, params: { preProcessor?: (data: T) => T, encoding?: string } = {},
): Promise<undefined> => mkPathDirs(to).then(() => read(from, params.encoding)).then((
  data: T,
): Promise<undefined> => {
  const { preProcessor, encoding } = params;
  const processedData = preProcessor ? preProcessor(data) : data;
  return new Promise((res: () => void, rej: (e: Error) => void) => {
    const callback = err => err ? rej(err) : res();
    if (encoding) {
      writeFile(to, processedData, encoding, callback);
    } else {
      writeFile(to, processedData, callback);
    }
  });
});

export const copyPack = <T extends string | Buffer>(
  items: {
    from: string; to: string; params: { preProcessor?: (data: T) => T, encoding?: string },
  }[],
): Promise<undefined> => {
  const item = items.shift();
  return item
    ? copy<T>(item.from, item.to, item.params).then(() => copyPack<T>(items))
    : Promise.resolve(undefined);
};
