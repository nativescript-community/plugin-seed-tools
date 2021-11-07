const fs = require('fs'); 
const exec = require('child_process').exec;

const pluginConfig = fs.readFileSync('config.json');
const pluginConfigJson = JSON.parse(pluginConfig);

let enabled = false;

if ("readme" in pluginConfigJson) {
    enabled = pluginConfigJson['readme'];
}

if (enabled) {
    fs.readdir('./packages', (error, files) => { 
        const packagesCount = files.length;

        let readmeOutput = "";

        if (packagesCount > 1) {
            readmeOutput += "This monorepo contains multiple packages:<br><br>";
        }

        for (const package of files) {
            const multiPackageMarkdown = `<details>
<summary><b>${package}</b></summary>

{{ load:packages/${package}/README.md }}
</details>`;

            const singlePackageMarkdown = `{{ load:packages/${package}/README.md }}`;

            if (packagesCount > 1) {
                readmeOutput += multiPackageMarkdown;
            } else {
                readmeOutput += singlePackageMarkdown;
            }
        }

        try {
            fs.writeFileSync('blueprint.md', readmeOutput)
        } catch (err) {
            console.error(err)
        }

        exec("./node_modules/.bin/readme generate -c ./tools/readme/blueprint.json", function(err, stdout, stderr) {
            if (err) {
            console.log(stderr)
            }
            console.log(stdout);
        });
    });
} else {
    console.log(`README generation is disabled. To enable, add "readme": true to the config.json`);
}