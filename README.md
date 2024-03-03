# sveltekit-cloudflare

This is a template for a SvelteKit project specifically designed to be deployed to Cloudflare Pages with a fully working local development environment that simulates several Cloudflare services such as KV store, D1 database, and R2 storage.

## How to use

Clone the project and install the dependencies:

```bash
git clone https://github.com/johnrcui/sveltekit-cloudflare.git

cd sveltekit-cloudflare

npm install
```

To start the local development server:

```bash
npm run dev
```

View the app in a browser at [localhost:5173](http://localhost:5173).

## How to deploy

Follow instructions in the [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/) to deploy the app to Cloudflare Pages.

For additional help, you can refer to the [SvelteKit documentation](https://kit.svelte.dev/docs/adapter-cloudflare).

## About the demo

The demo consists of

- simple todo application backed by a D1 database
- an example of using R2 storage to serve an image

On initial load, the app will not have a database or storage created. You can initialize the database and storage by clicking the "Initialize" button.

### Resetting the demo

To reset the demo, you can delete the database and storage by deleting the `.data` directory in the root of the project.