import { createHash } from 'crypto';
import { copyFileSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'fs';
import { basename, join } from 'path';

const changes = {
    devDependencies: {},
    scripts: {},
    ntl: {}
};

function parseFile(filePath) {
    // @ts-expect-error still working
    return JSON.parse(readFileSync(filePath));
}

const pluginPackageJSON = parseFile('./package.json');

// fix tools link to use portal
if (pluginPackageJSON.dependencies?.['@nativescript-community/plugin-seed-tools'] === 'file:tools') {
    pluginPackageJSON.dependencies['@nativescript-community/plugin-seed-tools'] = 'portal:tools';
} else if (pluginPackageJSON.devDependencies?.['@nativescript-community/plugin-seed-tools'] === 'file:tools') {
    pluginPackageJSON.devDependencies['@nativescript-community/plugin-seed-tools'] = 'portal:tools';
} 

function checkAndUpdate(json, field, packageJSON = pluginPackageJSON, replacer) {
    if (typeof json === 'object' && !Array.isArray(json)) {
        if (packageJSON[field] === undefined) {
            packageJSON[field] = {};
        }
        for (const [key, value] of Object.entries(json)) {
            if (typeof packageJSON[field][key] === 'undefined') {
                const actualValue = replacer ? replacer(value) : value;
                packageJSON[field][key] = actualValue;
            } else if (JSON.stringify(value) !== JSON.stringify(packageJSON[field][key])) {
                if (typeof value === 'object') {
                    packageJSON[field] = {};
                    packageJSON[field][key] = value;
                } else {
                    const actualValue = replacer ? replacer(value) : value;
                    packageJSON[field][key] = actualValue;
                }
            }
        }
    } else {
        packageJSON[field] = json;
    }
}

function deleteProperty(obj, match) {
    delete obj[match];
    for (const v of Object.values(obj)) {
        if (v instanceof Object) {
            deleteProperty(v, match);
        }
    }
}

function compareFile(file1, file2) {
    const file1Content = readFileSync(file1);
    const file2Content = readFileSync(file2);

    const hash1 = createHash('md5').update(file1Content).digest('hex');
    const hash2 = createHash('md5').update(file2Content).digest('hex');

    return hash1 === hash2;
}

function handleCommonFile(inFile, directory) {
    const actualDirectory = directory.replace('_template', '');
    const destFile = join(actualDirectory, basename(inFile));
    // const destFile = `./${directory.replace('_template', '')}${file}`;
    // const inFile = `./tools/common/${directory}${file}`;
    // console.log('handleCommonFile', inFile, destFile);
    if (lstatSync(inFile).isDirectory()) {
        if (!existsSync(destFile)) {
            mkdirSync(destFile);
        }
        handleCommonFiles(inFile, join(actualDirectory, basename(inFile), '/'));
    } else {
        if (!existsSync(destFile)) {
            console.log(`Copying common file over: ${inFile} in ${destFile}`);
            copyFileSync(inFile, destFile);
        } else if (!compareFile(destFile, inFile)) {
            console.log(`File: ${inFile} is different from common version, copying to ${destFile}`);
            copyFileSync(inFile, destFile);
        }
    }
}

function handleCommonFiles(commonFiles, directory) {
    readdirSync(commonFiles).forEach((file) => handleCommonFile(join(commonFiles, file), directory));
}

function removeOldFiles(files) {
    for (let i = 0; i < files.length; i++) {
        if (existsSync(files[i])) {
            unlinkSync(files[i]);
        }
    }
}

handleCommonFiles('./tools/common', '');
removeOldFiles(['./.eslintrc.js']);

const pluginConfigJson = parseFile('config.json');

const pluginAngular = pluginConfigJson['angular'];
const pluginDemos = pluginConfigJson['demos'];

const commonLernaJSON = parseFile('./tools/lerna.template.json');
let lernaJSON = parseFile('./lerna.json');
lernaJSON = { version: lernaJSON.version, ...commonLernaJSON };
writeFileSync('./lerna.json', JSON.stringify(lernaJSON, null, 4) + '\n');

const commonPackageJSON = parseFile('./tools/package.json.template');
checkAndUpdate(commonPackageJSON['scripts'], 'scripts');
checkAndUpdate(commonPackageJSON['ntl'], 'ntl');
checkAndUpdate(commonPackageJSON['workspaces'], 'workspaces');
checkAndUpdate(commonPackageJSON['engines'], 'engines');
checkAndUpdate(commonPackageJSON['packageManager'], 'packageManager');

if (!pluginAngular) {
    deleteProperty(pluginPackageJSON, 'build.angular');
    pluginPackageJSON['scripts']['build.all'] = 'npm run build';
}

if (!pluginDemos.includes('ng')) {
    deleteProperty(pluginPackageJSON, 'demo.ng.android');
    deleteProperty(pluginPackageJSON, 'demo.ng.ios');
    deleteProperty(pluginPackageJSON, 'demo.ng.clean');
}

if (!pluginDemos.includes('react')) {
    deleteProperty(pluginPackageJSON, 'demo.react.android');
    deleteProperty(pluginPackageJSON, 'demo.react.ios');
    deleteProperty(pluginPackageJSON, 'demo.react.clean');
}

if (!pluginDemos.includes('svelte')) {
    deleteProperty(pluginPackageJSON, 'demo.svelte.android');
    deleteProperty(pluginPackageJSON, 'demo.svelte.ios');
    deleteProperty(pluginPackageJSON, 'demo.svelte.clean');
}

if (!pluginDemos.includes('vue')) {
    deleteProperty(pluginPackageJSON, 'demo.vue.android');
    deleteProperty(pluginPackageJSON, 'demo.vue.ios');
    deleteProperty(pluginPackageJSON, 'demo.vue.clean');
}

writeFileSync('./package.json', JSON.stringify(pluginPackageJSON, null, 4) + '\n');
console.log('Common files and package.json have been synced.');

// handle packages
const commonPackagesPackageJSON = parseFile('./tools/packages/package.json.template');

readdirSync('./packages').forEach((file) => {
    const jsonPath = join('./packages', file, 'package.json');
    const packagePackageJSON = parseFile(jsonPath);
    checkAndUpdate(commonPackagesPackageJSON['scripts'], 'scripts', packagePackageJSON, (v) => v.replaceAll('${PACKAGE_NAME}', file));
    const pluginAngular = existsSync(join('./src', file, 'angular'));
    if (!pluginAngular) {
        deleteProperty(packagePackageJSON, 'build.angular');
        packagePackageJSON['scripts']['build.all'] = 'npm run build';
    }
    writeFileSync(jsonPath, JSON.stringify(packagePackageJSON, null, 4) + '\n');
});
console.log('packages package.json have been synced.');
