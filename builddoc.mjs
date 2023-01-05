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
export async function createTypeScriptApiDocs({ outDir }, typeDocOptions = {}) {
    const app = new td.Application();
    const currentPath = path.join(process.cwd());
    app.options.addReader(new td.TSConfigReader());
    const files = await globby(['packages/**/package.json'], {
        absolute: true,
        deep: 2,
        cwd: currentPath
    });
    const actualTypings = files.map((p) => path.relative(path.join(currentPath, ''), path.join(path.dirname(p), JSON.parse(fs.readFileSync(p)).typings)));
    console.log('createTypeScriptApiDocs', typeDocOptions, currentPath, actualTypings);
    app.bootstrap({
        logger: 'console',
        readme: path.join(currentPath, 'README.md'),
        disableSources: false,
        excludeExternals: true,
        cleanOutputDir: true,
        tsconfig: 'tools/tsconfig.doc.json',
        gitRevision: 'master',
        logLevel: 'Verbose',
        entryPointStrategy: td.EntryPointStrategy.Resolve,
        entryPoints: actualTypings,
        navigationLinks: {
            'Nativescript Doc': 'https://docs.nativescript.org'
        },
        ...typedocJson,
        ...typeDocOptions
    });
    //@ts-ignore
    app.options.setCompilerOptions(actualTypings, {
        esModuleInterop: true
    });
    // const program = ts.createProgram(app.options.getFileNames(), app.options.getCompilerOptions());

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
    await createTypeScriptApiDocs({ outDir: 'docs' });
} catch (err) {
    console.error(err);
}
