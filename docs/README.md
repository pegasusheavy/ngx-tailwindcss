# ngx-tailwindcss Documentation App

Angular application serving the documentation and live demos for
[ngx-tailwindcss](https://github.com/quinnjr/ngx-tailwindcss): component demo
pages, theming guide, and full example applications.

## Prerequisites

The docs app consumes the built library via
`"ngx-tailwindcss": "file:../dist/ngx-tailwindcss"`, so the library
must be built first. From the repository root:

```bash
pnpm install
pnpm run build   # builds the library into dist/ngx-tailwindcss
```

Then install the docs app's dependencies:

```bash
cd docs
pnpm install
```

## Development server

The recommended workflow is from the repository root, which rebuilds the
library on change and serves the docs concurrently:

```bash
pnpm run dev
```

Alternatively, run the docs app alone from this directory:

```bash
pnpm run dev     # ng serve with polling; picks a random free port
pnpm run start   # ng serve; picks a random free port
```

Both scripts use `--port 0`, so check the terminal output for the URL to open.

## Building

```bash
pnpm run build
```

Build artifacts are written to `dist/`.

## Unit tests

```bash
ng test
```

There is no end-to-end test target.
