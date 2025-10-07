const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const changes = {
    devDependencies: {},
    scripts: {},
    ntl: {}
};

const pluginPackageJSON = JSON.parse(fs.readFileSync('./package.json'));

// fix tools link to use portal
if (pluginPackageJSON.dependencies['@nativescript-community/plugin-seed-tools'] === 'file:tools') {
    pluginPackageJSON.dependencies['@nativescript-community/plugin-seed-tools'] = 'portal:tools';
}

function checkAndUpdate(json, field) {
    if (typeof json === 'object' && !Array.isArray(json)) {
        if (pluginPackageJSON[field] === undefined) {
            pluginPackageJSON[field] = {};
        }
        for (const [key, value] of Object.entries(json)) {
            if (typeof pluginPackageJSON[field][key] === 'undefined') {
                pluginPackageJSON[field][key] = value;
            } else if (JSON.stringify(value) !== JSON.stringify(pluginPackageJSON[field][key])) {
                if (typeof value === 'object') {
                    pluginPackageJSON[field] = {};
                    pluginPackageJSON[field][key] = value;
                } else {
                    pluginPackageJSON[field][key] = value;
                }
            }
        }
    } else {
        pluginPackageJSON[field] = json;
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
    const file1Content = fs.readFileSync(file1);
    const file2Content = fs.readFileSync(file2);

    const hash1 = crypto.createHash('md5').update(file1Content).digest('hex');
    const hash2 = crypto.createHash('md5').update(file2Content).digest('hex');

    return hash1 === hash2;
}

function handleCommonFile(inFile, directory) {
    const actualDirectory = directory.replace('_template', '');
    const destFile = path.join(actualDirectory, path.basename(inFile));
    // const destFile = `./${directory.replace('_template', '')}${file}`;
    // const inFile = `./tools/common/${directory}${file}`;
    // console.log('handleCommonFile', inFile, destFile);
    if (fs.lstatSync(inFile).isDirectory()) {
        if (!fs.existsSync(destFile)) {
            fs.mkdirSync(destFile);
        }
        handleCommonFiles(inFile, path.join(actualDirectory, path.basename(inFile), '/'));
    } else {
        if (!fs.existsSync(destFile)) {
            console.log(`Copying common file over: ${inFile} in ${destFile}`);
            fs.copyFileSync(inFile, destFile);
        } else if (!compareFile(destFile, inFile)) {
            console.log(`File: ${inFile} is different from common version, copying to ${destFile}`);
            fs.copyFileSync(inFile, destFile);
        }
    }
}

function handleCommonFiles(commonFiles, directory) {
    fs.readdirSync(commonFiles).forEach((file) => handleCommonFile(path.join(commonFiles, file), directory));
}

handleCommonFiles('./tools/common', '');
fs.readdirSync('./packages').forEach((file) => handleCommonFiles('./tools/packages_common', path.join('./packages', file)));

const pluginConfig = fs.readFileSync('config.json');
const pluginConfigJson = JSON.parse(pluginConfig);

const pluginAngular = pluginConfigJson['angular'];
const pluginDemos = pluginConfigJson['demos'];

const commonLernaJSON = JSON.parse(fs.readFileSync('./tools/lerna.template.json'));
let lernaJSON = JSON.parse(fs.readFileSync('./lerna.json'));
lernaJSON = { version: lernaJSON.version, ...commonLernaJSON };
fs.writeFileSync('./lerna.json', JSON.stringify(lernaJSON, 0, 4) + '\n');

const commonPackageJSON = JSON.parse(fs.readFileSync('./tools/package.json.template'));
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

fs.writeFileSync('./package.json', JSON.stringify(pluginPackageJSON, 0, 4) + '\n');
console.log('Common files and package.json have been synced.');
