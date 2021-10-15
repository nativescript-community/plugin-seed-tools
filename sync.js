const fs = require('fs');
const crypto = require('crypto');
const { argv } = require('yargs').option('w', {
    alias: 'write',
    default: false,
    describe: 'Write synced plugin to package.json',
    type: 'boolean'
});

const { write } = argv;

const changes = {
    devDependencies: {},
    scripts: {},
    ntl: {}
};

const pluginPackageJSON = JSON.parse(fs.readFileSync('./package.json'));

function checkAndUpdate(json, field) {
    if (pluginPackageJSON[field] === undefined) {
        pluginPackageJSON[field] = {};
    }

    for (const [key, value] of Object.entries(json)) {
        if (typeof pluginPackageJSON[field][key] === 'undefined') {
            if (write) {
                pluginPackageJSON[field][key] = value;
            }
        } else if (JSON.stringify(value) !== JSON.stringify(pluginPackageJSON[field][key])) {
            if (typeof value === 'object') {
                pluginPackageJSON[field] = {};
                pluginPackageJSON[field][key] = value;
            } else {
                pluginPackageJSON[field][key] = value;
            }
        }
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

fs.readdirSync('./tools/common').forEach((file) => {
    if (!fs.existsSync(`./${file}`)) {
        if (write) {
            console.log('Copying common file over.');
            fs.copyFileSync(`./tools/common/${file}`, `./${file}`);
        }
    }
    else if (!compareFile(`./${file}`, `./tools/common/${file}`)) {
        console.log(`File: ${file} is different from common version.`);
        if (write) {
            console.log('Copying common file over.');
            fs.copyFileSync(`./tools/common/${file}`, `./${file}`);
        }
    }
});

const pluginConfig = fs.readFileSync('config.json');
const pluginConfigJson = JSON.parse(pluginConfig);

const pluginAngular = pluginConfigJson['angular'];
const pluginDemos = pluginConfigJson['demos'];

const commonPackageJSON = JSON.parse(fs.readFileSync('./tools/package.json'));
checkAndUpdate(commonPackageJSON['devDependencies'], 'devDependencies');
checkAndUpdate(commonPackageJSON['scripts'], 'scripts');
checkAndUpdate(commonPackageJSON['ntl'], 'ntl');

if (!pluginAngular) {
    deleteProperty(pluginPackageJSON, 'build.angular');
    deleteProperty(pluginPackageJSON, 'build.all');
}

if (!pluginDemos.includes('ng')) {
    deleteProperty(pluginPackageJSON, 'demo.ng.android');
    deleteProperty(pluginPackageJSON, 'demo.ng.ios');
}

if (!pluginDemos.includes('react')) {
    deleteProperty(pluginPackageJSON, 'demo.react.android');
    deleteProperty(pluginPackageJSON, 'demo.react.ios');
}

if (!pluginDemos.includes('svelte')) {
    deleteProperty(pluginPackageJSON, 'demo.svelte.android');
    deleteProperty(pluginPackageJSON, 'demo.svelte.ios');
}

if (!pluginDemos.includes('vue')) {
    deleteProperty(pluginPackageJSON, 'demo.vue.android');
    deleteProperty(pluginPackageJSON, 'demo.vue.ios');
}

if (write) {
    console.log('The following changes are being made to package.json');
    fs.writeFileSync('./package.json', JSON.stringify(pluginPackageJSON, 0, 4));
} else {
    console.log('These are the changes that are going to be written:');
    console.log(pluginPackageJSON);
    console.log('To write these changes run `npm run sync`');
}
