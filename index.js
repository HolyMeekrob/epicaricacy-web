import metalsmith from 'metalsmith';
import branch from 'metalsmith-branch';
import drafts from 'metalsmith-drafts';
import layouts from 'metalsmith-layouts';
import markdown from 'metalsmith-markdownit';
import permalinks from 'metalsmith-permalinks';
import serve from 'metalsmith-serve';
import transformer from 'metalsmith-transformer';
import watch	 from 'metalsmith-watch';
import nunjucks from 'nunjucks';

import layoutConfig from './config/layouts';
import markdownConfig from './config/markdown';
import serveConfig from './config/serve';
import watchConfig from './config/watch';
import permalinkConfig from './config/permalinks';

import { includeFile, lineEndingsTransformer } from './config/lineEndings';

import { cleanDir } from './clean';

nunjucks.configure('src/templates', { watch: false, nocache: true });

const addBuild = (ms) =>
	ms.build((err) => {
		if (err) {
			console.error(err);
		}
		else {
			console.log('Build complete');
		}
	});

const addServe = (ms) =>
	ms
		.use(serve(serveConfig))
		.use(watch(watchConfig));

const getBase = () =>
	metalsmith(__dirname)
		.source('./src/content')
		.clean(false)
		.use(drafts())
		.use(markdown(markdownConfig))
		.use(layouts(layoutConfig))
		.use(permalinks(permalinkConfig))
		.use(branch(includeFile)
			.use(transformer(lineEndingsTransformer)))
		.destination('./dist');

const build = () =>	addBuild(getBase());

const buildAndServe =	() => addBuild(addServe(getBase()));

const clean = () => {
	cleanDir('./dist');
	console.log('Clean complete');
};

const help = () => {
	console.log('build:\t\tBuild source to output');
	console.log('start:\t\tBuild source and start server');
	console.log('help:\t\tOutput this help');
};

const commandIndex = 2;

switch (process.argv[commandIndex]) {
	case 'build':
		clean();
		build();
		break;

	case 'clean':
		clean();
		break;

	case 'buildAndServe':
		clean();
		buildAndServe();
		break;

	case 'help':
		help();
		break;

	default:
		console.error(`Unsupported command: ${process.argv[commandIndex]}`);
		break;
}
