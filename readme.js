const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

const pluginConfig = fs.readFileSync('config.json');
const pluginConfigJson = JSON.parse(pluginConfig);

function listFoldersSync(dir) {
    const folders = [];
    fs.readdirSync(dir).forEach((f) => {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            folders.push(f);
        }
    });
    return folders;
}

let enabled = false;

if ('readme' in pluginConfigJson) {
    enabled = pluginConfigJson['readme'];
}

if (enabled) {
    const files = listFoldersSync('./packages');
    const packagesCount = files.length;

    let readmeOutput = '';

    if (fs.existsSync('header.md')) {
        readmeOutput += '{{ load:header.md }}\n';
    }
    if (packagesCount > 1) {
        readmeOutput += 'This monorepo contains multiple packages:<br><br>';
    }

    for (const package of files) {
        const multiPackageMarkdown = `\n<details open>
<summary><b>${package}</b></summary>
\n{{ load:packages/${package}/README.md }}
</details>`;

        const singlePackageMarkdown = `{{ load:packages/${package}/README.md }}`;

        if (packagesCount > 1) {
            readmeOutput += multiPackageMarkdown;
        } else {
            readmeOutput += singlePackageMarkdown;
        }
    }


    if (fs.existsSync('info.md')) {
        readmeOutput += '\n{{ load:info.md }}';
    }

    readmeOutput += '\n{{ load:tools/readme/demos-and-development.md }}{{ load:tools/readme/questions.md }}';

    if (fs.existsSync('footer.md')) {
        readmeOutput += '\n{{ load:footer.md }}';
    }

    try {
        fs.writeFileSync('blueprint.md', readmeOutput);
    } catch (err) {
        console.error(err);
    }

    exec('./node_modules/.bin/readme generate -c ./tools/readme/blueprint.json', function (err, stdout, stderr) {
        if (err) {
            console.log(stderr);
        }
        console.log(stdout);
    });
} else {
    console.log('README generation is disabled. To enable, add "readme": true to the config.json');
}
