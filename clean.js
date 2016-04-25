import fs from 'fs';

const excludedFiles = ['CNAME', '.git'];
const excludedDirs = [];

const deleteFolderRecursive = (path) => {
	if (fs.existsSync(path)) {
		fs.readdirSync(path).forEach((file) => {
			const curPath = `${path}/${file}`;
			if (fs.lstatSync(curPath).isDirectory()) {
				deleteFolderRecursive(curPath);
			}
			else {
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path);
	}
};

export const cleanDir = (baseDir) => {
	const getPath = (itemName) => `${baseDir}/${itemName}`;

	const dirContents = fs.readdirSync(baseDir);
	const dirStats = dirContents.map((item) => {
		return {
			name: item,
			stats: fs.statSync(getPath(item))
		};
	});

	const filesToDelete = dirStats.filter((itemObj) => {
		return itemObj.stats.isFile() && !excludedFiles.includes(itemObj.name);
	});

	const dirsToDelete = dirStats.filter((itemObj) => {
		return itemObj.stats.isDirectory() && !excludedDirs.includes(itemObj.name);
	});

	filesToDelete.forEach((file) => {
		fs.unlinkSync(getPath(file.name));
	});

	dirsToDelete.forEach((dir) => {
		deleteFolderRecursive(getPath(dir.name));
	});
};
