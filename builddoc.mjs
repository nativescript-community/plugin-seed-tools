import td from 'typedoc';
import ts from 'typescript';
import * as path from 'path';
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
    console.log('createTypeScriptApiDocs', typeDocOptions, currentPath);
    const files = await globby(['src/**/*.d.ts', 'src/**/index.ts', 'src/**/*common.ts', '!**/references.d.ts', '!**/typings', '!**/angular', '!**/vue', '!**/svelte', '!**/react'], {
        absolute: true,
        cwd: currentPath
    });
    app.bootstrap({
        logger: 'console',
        readme: path.join(currentPath, 'README.md'),
        disableSources: false,
        excludeExternals: true,
        cleanOutputDir: true,
        tsconfig: 'tools/tsconfig.doc.json',
        gitRevision: 'master',
        entryPointStrategy: td.EntryPointStrategy.Resolve,
        entryPoints: files,
        "navigationLinks": {
            "Nativescript Doc": "https://docs.nativescript.org"
        },
        ...typedocJson,
        ...typeDocOptions
    });
    //@ts-ignore
    app.options.setCompilerOptions(files, {
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
