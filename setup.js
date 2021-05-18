const fs = require('fs');
const fse = require('fs-extra');
const exec = require('child_process').exec;

const framework = __dirname + '/../../package.json';
const pathSnippets = __dirname + '/../../../demo-snippets/package.json';

try {
    if (fs.existsSync(framework) && fs.existsSync(pathSnippets)) {
        // Load dependencies for snippets
        const snippetsPackageJson = JSON.parse(fs.readFileSync(pathSnippets));
        const snippetsDependencies = snippetsPackageJson['dependencies'];
        const snippetsDevDependencies = snippetsPackageJson['devDependencies'];

        // Load dependencies for demo
        const frameworkPackageJson = JSON.parse(fs.readFileSync(framework));
        const frameworkDependencies = frameworkPackageJson['dependencies'];
        const frameworkDevDependencies = frameworkPackageJson['devDependencies'];
        let changed = false;

        // Merge together dependencies
        if (snippetsDependencies) {
            for (const [key, value] of Object.entries(snippetsDependencies)) {
                if (typeof frameworkDependencies[key] !== 'undefined') {
                    if (frameworkDependencies[key] !== value) {
                        frameworkDependencies[key] = value;
                        changed = true;
                    }
                } else {
                    frameworkDependencies[key] = value;
                    changed = true;
                }
            }
        }

        // Merge together dev dependencies
        if (snippetsDevDependencies) {
            for (const [key, value] of Object.entries(snippetsDevDependencies)) {
                if (typeof frameworkDevDependencies[key] !== 'undefined') {
                    if (frameworkDevDependencies[key] !== value) {
                        frameworkDevDependencies[key] = value;
                        changed = true;
                    }
                } else {
                    frameworkDevDependencies[key] = value;
                    changed = true;
                }
            }
        }

        const appResourcesDemo = __dirname + '/../../App_Resources';
        const appResourcesSnippets = __dirname + '/../../../demo-snippets/App_Resources';

        // Copy App_Resources from snippets to demo
        if (fs.existsSync(appResourcesSnippets) && fs.existsSync(appResourcesDemo)) {
            console.log('Copying App_Resouces from demo-snippets to demo...');
            fse.copySync(appResourcesSnippets, appResourcesDemo, { recursive: true });
        }

        // Save changes to demo package.json
        if (changed) {
            fs.writeFileSync(framework, JSON.stringify(frameworkPackageJson, 0, 4));
            child = exec('ns install --path=' + __dirname + '/../..').stderr.pipe(process.stderr);
        }
    }
} catch (err) {
    console.error(err);
}
