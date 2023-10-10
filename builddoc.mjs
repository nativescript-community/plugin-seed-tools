import td from 'typedoc';
import * as path from 'path';
import * as fs from 'fs';
import globby from 'globby';

import typedocJson from './typedoc.js';

/**
 * @param {Object} options
 *  @param {string} options.entryPoint
 *  @param {string} options.outDir
 * @param {Partial<import('typedoc').TypeDocOptions>} [typeDocOptions]
 */
export async function createTypeScriptApiDocs({ outDir, includeSubDirDefinitions }, typeDocOptions = {}) {
    const currentPath = path.join(process.cwd());
    let otherFiles = [];
    if (includeSubDirDefinitions === true) {
        otherFiles = await globby(
            ['packages/*/*/**/*.d.ts', '!**/*.android.d.ts', '!**/*.ios.d.ts', '!**/*.common.d.ts', '!*node_modules*', '!**/vue/**/*', '!**/angular/**/*', '!**/svelte/**/*', '!**/react/**/*'],
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
    console.log('createTypeScriptApiDocs', typeDocOptions, currentPath, otherFiles);
    const app = await td.Application.bootstrap({
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
    }, [new td.PackageJsonReader(), new td.TSConfigReader()]);
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

try {
    let docOptions = {};
    try {
        const config = JSON.parse(fs.readFileSync('./config.json'));
        if (config.doc) {
            docOptions = config.doc;
        }
    } catch (error) {
        console.error('error parsing config', error);
    }
    await createTypeScriptApiDocs({ outDir: 'docs', ...docOptions });
} catch (err) {
    console.error(err);
}
