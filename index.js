import { default as metalsmith } from 'metalsmith';
import { default as drafts } from 'metalsmith-drafts';
import { default as layouts } from 'metalsmith-layouts';
import { default as markdown } from 'metalsmith-markdown';
import { default as serve } from 'metalsmith-serve';
import { default as watch } from 'metalsmith-watch';
import * as nunjucks from 'nunjucks';

import layoutConfig from './config/layouts';
import serveConfig from './config/serve';
import watchConfig from './config/watch';

nunjucks.configure('src/templates', { watch: false, nocache: true });

const addBuild = (ms) =>
	ms
		.build((err) => {
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
		.destination('./dist')
		.clean(false)
		.use(drafts())
		.use(markdown())
		.use(layouts(layoutConfig));

const build = () =>	addBuild(getBase());

const buildAndServe =	() => addBuild(addServe(getBase()));

const help = () => {
	console.log('build:\t\tBuild source to output');
	console.log('start:\t\tBuild source and start server');
	console.log('help:\t\tOutput this help');
};

const commandIndex = 2;

switch (process.argv[commandIndex]) {
	case 'build':
		build();
		break;

	case 'buildAndServe':
		buildAndServe();
		break;

	case 'help':
		help();
		break;

	default:
		console.error(`Unsupported command: ${process.argv[commandIndex]}`);
		break;
}
