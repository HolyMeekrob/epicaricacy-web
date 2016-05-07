import metalsmith from 'metalsmith';
import branch from 'metalsmith-branch';
import collections from 'metalsmith-collections';
import dateFormatter from 'metalsmith-date-formatter';
import drafts from 'metalsmith-drafts';
import excerpts from 'metalsmith-better-excerpts';
import feed from 'metalsmith-feed';
import layouts from 'metalsmith-layouts';
import markdown from 'metalsmith-markdownit';
import pageData from 'metalsmith-page-data';
import pagination from 'metalsmith-pagination';
import permalinks from 'metalsmith-permalinks';
import postcss from 'metalsmith-postcss';
import serve from 'metalsmith-serve';
import transformer from 'metalsmith-transformer';
import nunjucks from 'nunjucks';

import collectionConfig from './config/collections';
import cssConfig from './config/postcss';
import dateConfig from './config/dates';
import excerptConfig from './config/excerpts';
import yftsFeedConfig from './config/feed';
import layoutConfig from './config/layouts';
import markdownConfig from './config/markdown';
import serveConfig from './config/serve';
import pageDataConfig from './config/pageData';
import paginationConfig from './config/pagination';
import permalinkConfig from './config/permalinks';

import { includeFile, options as transformerConfig } from './config/lineEndings';

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

const addServe = (ms) => ms.use(serve(serveConfig));

const getBase = () =>
	metalsmith(__dirname)
		.metadata({
			site: {
				url: 'http://www.epicaricacy.com'
			}
		})
		.source('./src/content')
		.clean(false)
		.use(drafts())
		.use(markdown(markdownConfig))
		.use(collections(collectionConfig))
		.use(permalinks(permalinkConfig))
		.use(excerpts(excerptConfig))
		.use(feed(yftsFeedConfig))
		.use(pagination(paginationConfig))
		.use(pageData(pageDataConfig))
		.use(dateFormatter(dateConfig))
		.use(layouts(layoutConfig))
		.use(branch(includeFile)
			.use(transformer(transformerConfig)))
		.use(postcss(cssConfig))
		.destination('./dist');

const build = () =>	addBuild(getBase());

const buildAndServe =	() => addBuild(addServe(getBase()));

const clean = () => {
	cleanDir('./dist');
	console.log('Clean complete');
};

const help = () => {
	console.log('build:\t\tBuild source to output');
	console.log('clean:\t\tClean output directory');
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
