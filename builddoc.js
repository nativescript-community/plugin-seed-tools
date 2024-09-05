// import td from 'typedoc';
const td = require('typedoc');
const path = require('path');
const fs = require('fs');
// import * as path from 'path';
// import * as fs from 'fs';

// import typedocJson from './typedoc.js';
const typedocJson = require('./typedoc.js');

/**
 * @param {Object} options
 *  @param {string} options.entryPoint
 *  @param {string} options.outDir
 * @param {Partial<import('typedoc').TypeDocOptions>} [typeDocOptions]
 */
async function createTypeScriptApiDocs({ outDir }, options = {}) {
    let globby = await import('globby');
    globby = globby.globby || globby;
    const currentPath = path.join(process.cwd());
    let otherFiles = [];
    const { includeSubDirDefinitions, ...typeDocOptions } = options;
    if (includeSubDirDefinitions === true) {
        otherFiles = await globby(
            ['packages/*/*/**/*.d.ts', '!**/*.android.d.ts', '!**/*.ios.d.ts', '!**/*.common.d.ts', '!**/node_modules', '!**/vue/**/*', '!**/angular/**/*', '!**/svelte/**/*', '!**/react/**/*'],
            {
                absolute: true,
                followSymbolicLinks: false,
                cwd: currentPath
            }
        );
    }
    const files = await globby(['packages/**/package.json'], {
        absolute: true,
        followSymbolicLinks: false,
        deep: 2,
        cwd: currentPath
    });
    const actualTypings = files.map((p) => path.relative(path.join(currentPath, ''), path.join(path.dirname(p), JSON.parse(fs.readFileSync(p)).typings)));
    const allFiles = actualTypings.concat(otherFiles);
    console.log('createTypeScriptApiDocs', typeDocOptions, currentPath);
    const app = await td.Application.bootstrapWithPlugins(
        {
            // logger: 'console',
            readme: path.join(currentPath, 'README.md'),
            disableSources: false,
            excludeExternals: true,
            cleanOutputDir: true,
            tsconfig: 'tools/tsconfig.doc.json',
            gitRevision: 'master',
            logLevel: 'Verbose',
            entryPointStrategy: td.EntryPointStrategy.Resolve,
            entryPoints: allFiles,
            navigationLinks: {
                'Nativescript Doc': 'https://docs.nativescript.org'
            },
            ...typedocJson,
            ...typeDocOptions
        },
        [new td.PackageJsonReader(), new td.TSConfigReader()]
    );
    // app.bootstrap();
    //@ts-ignore
    app.options.setCompilerOptions(allFiles, {
        esModuleInterop: true
    });

    const project = app.converter.convert(app.getEntryPoints() ?? []);

    if (project) {
        await app.generateDocs(project, outDir);
    } else {
        throw new Error('Error creating the typedoc project');
    }
}
// app.generateDocs(project, "./docs");
// app.generateJson(project, "./docs.json");
new Promise(async function (resolve, reject) {
    try {
        let docOptions = {};
        try {
            const config = JSON.parse(fs.readFileSync('./config.json'));
            if (config.doc) {
                docOptions = config.doc;
            }
            console.error('docOptions', config, docOptions);
        } catch (error) {
            console.error('error parsing config', error);
        }
        await createTypeScriptApiDocs({ outDir: 'docs' }, docOptions);
        resolve();
    } catch (err) {
        console.error(err);
        reject(err);
    }
});
