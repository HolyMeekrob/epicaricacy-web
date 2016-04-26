import path from 'path';

const filetypes = ['.js', '.css', '.html', '.md'];

export const includeFile = (filename, props, i) => // eslint-disable-line no-unused-vars
	filetypes.includes(path.extname(filename.toLowerCase()));

const lineEndingsTransformer = (str) => str.replace(/([^\r])\n/g, '$1\r\n');

export const options = {
	transformer: lineEndingsTransformer
};