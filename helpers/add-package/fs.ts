import { stat, Stats, mkdir, readFile, writeFile } from 'fs';
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

export const appendText = (
  filePath: string, text: string, after?: string,
): Promise<undefined> => checkExists(filePath).then((exists: boolean) => {
  if (!exists) return Promise.reject(new Error(EXISTS_ERROR));
  return new Promise((res: (data: string) => void, rej: (e: Error) => void) => {
    readFile(filePath, 'utf-8', (err: Error, data: string) => err ? rej(err) : res(data));
  });
}).then((data: string): Promise<undefined> => {
  return new Promise((res: () => void, rej: (e: Error) => void) => {
    if (after && !data.includes(data)) return rej(new Error(NOT_FOUND_ERROR));
    const updatedText = after ? data.replace(after, `${after}${text}`) : `${data}${after}`;
    writeFile(filePath, updatedText, 'utf-8', err => err ? rej(err) : res());
  });
});

export const mkDir = (dirPath: string): Promise<undefined> => checkExists(dirPath)
  .then((exists: boolean) => new Promise((res: () => void, rej: (e: Error) => void) => {
    if (exists) return rej(new Error(EXISTS_ERROR));
    mkdir(dirPath, err => err ? rej(err) : res());
  }));
