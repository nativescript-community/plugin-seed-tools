const packageJSON = require('../package.json');
module.exports = {
    out: 'docs',
    exclude: ['**/node_modules/**', '**/*.spec.ts', '*typings*'],
    name: packageJSON.description,
    excludePrivate: true,
    excludePrivate: true,
    excludeExternals: true,
    tsconfig: 'tools/tsconfig.doc.json',
    readme: '../README.md'
};
