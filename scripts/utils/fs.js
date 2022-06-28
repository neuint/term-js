/* eslint-disable
global-require, import/no-dynamic-require, no-use-before-define, @typescript-eslint/no-var-requires
*/
const fs = require('fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const rimraf = require('rimraf');
const path = require('path');

const api = {
  mkdir: async (dirPath) => new Promise((resolve, reject) => {
    fs.mkdir(dirPath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  }),

  checkFolder: async (checkPath) => new Promise((resolve, reject) => {
    fs.stat(checkPath, (err, stats) => {
      if (err && !err.message.includes('ENOENT')) {
        reject(err);
      } else {
        resolve(stats ? stats.isDirectory() : false);
      }
    });
  }),

  rimraf: async (targetPath) => {
    const stats = await api.getStats(targetPath);
    if (!stats) return Promise.resolve(true);
    return new Promise((res) => {
      rimraf(targetPath, res);
    });
  },

  readFile: async (filePath, json = false) => new Promise((res) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) return res(null);
      if (!json) return res(data);
      try {
        return res(JSON.parse(data));
      } catch (e) {
        return res(null);
      }
    });
  }),

  writeFile: async (filePath, data) => new Promise((res) => {
    fs.writeFile(filePath, data, (err) => {
      res(!err);
    });
  }),

  folderFiles: async (folderPath) => new Promise((res, rej) => {
    fs.readdir(folderPath, (err, list) => {
      if (err) {
        rej(err);
      } else {
        Promise.all(list.map((name) => api.checkFolder(path.join(folderPath, name))))
          .then((resultList) => {
            res(list.filter((_, index) => !resultList[index]));
          })
          .catch(rej);
      }
    });
  }),

  getStats: async (targetPath) => new Promise((res) => {
    fs.lstat(targetPath, (err, stats) => {
      res(!err ? stats : null);
    });
  }),
};

module.exports = api;
