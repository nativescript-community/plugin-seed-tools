## Demos and Development


### Repo Setup

The package manager used to install and link dependencies must be `pnpm` or `yarn`. `npm` wont work.

To develop and test:

Run `pnpm i` or `yarn i` in root folder.
Run `pnpm i` or `yarn i` in all demo apps folders.

You can also run `npm run yarn.setup` or `npm run pnpm.setup` in root folder to do it all in one steps

**Interactive Menu:**

To start the interactive menu, run `npm start` (or `yarn start` or `pnpm start`). This will list all of the commonly used scripts.

### Build

```bash
npm run build.all
```

### Demos

```bash
npm run demo.[ng|react|svelte|vue].[ios|android]

npm run demo.svelte.ios # Example
```