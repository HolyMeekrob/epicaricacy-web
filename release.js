import fs from 'fs';
import path from 'path';
import moment from 'moment';

const encoding = 'utf8';

const flatten = (arr) =>
	arr.reduce((arr1, arr2) =>
		arr1.concat(arr2), []);

const writeFile = (filepath, updatedContents) => {
	return new Promise((resolve, reject) => {
		fs.writeFile(filepath, updatedContents, encoding, (err) => {
			if (err) {
				reject(err);
			}
			resolve(filepath);
		});
	});
};

const updateFile = (filepath) => {
	return new Promise((resolve, reject) => {
		fs.readFile(filepath, encoding, (err, contents) => {
			if (err) {
				reject(err);
			}

			const draftExp = /^draft:\s*true\s*$/m;
			if (draftExp.test(contents)) {
				const publishDate = moment(Date.now());
				const dateStr = publishDate.format('YYYY-MM-DD');
				const updatedContents = contents.replace(draftExp, `publishDate: ${dateStr}`);
				resolve(writeFile(filepath, updatedContents));
			}
			else {
				resolve();
			}
		});
	});
};

const getParentDir = (dirPath) => {
	return dirPath.split(path.sep).pop();
};

export const releaseFiles = (filenames, dir, file) => {
	const filepath = file === undefined
		? path.resolve(dir)
		: path.resolve(dir, file);

	return new Promise((resolve, reject) => {
		fs.stat(filepath, (err, filestat) => {
			if (err) {
				reject(err);
			}

			if (filestat.isFile()) {
				const fileObj = path.parse(filepath);
				const parentDir = getParentDir(fileObj.dir);
				if (filenames.includes('all')
					|| filenames.includes(fileObj.name)
					|| (fileObj.name === 'index' && filenames.includes(parentDir))) {
					resolve(updateFile(filepath));
				}
				else {
					resolve();
				}
			}

			else if (filestat.isDirectory()) {
				fs.readdir(filepath, (e, files) => {
					if (e) {
						reject(e);
					}

					resolve(Promise.all(files.map((dirFile) =>
						releaseFiles(filenames, filepath, dirFile)))
						.then((dirFiles) => {
							if (Array.isArray(dirFiles)) {
								return flatten(dirFiles);
							}
							return dirFiles;
						}));
				});
			}

			else {
				resolve();
			}
		});
	});
};
