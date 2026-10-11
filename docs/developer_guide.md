# Developer Guide

## Prerequisites

In order to get started developing the web remote, you'll need to install the following on your computer:

- NodeJS
- NPM
- PNPM

## Get Started

Once you have the prerequisites installed, in the root directory, run the following command:

```sh
pnpm install
```

To run the web remote, run the following command:

```sh
pnpm start
```

To build the web remote manually for deployment:

```sh
pnpm build --aot
```

To lint the web remote:

```sh
pnpm lint
```

To audit the web remote:

```sh
pnpm audit
```

To install the Playwright browsers for testing:

```sh
pnpm playwright install
```

To run both unit tests and end-to-end Playwright tests on Web Remote:

```sh
pnpm test
```

To run unit tests on Web Remote:

```sh
pnpm test:unit
```

To run unit tests coverage report on Web Remote:

```sh
pnpm test:unit:coverage
```

To run unit tests in watch mode on Web Remote:

```sh
pnpm test:unit:watch
```

To run end-to-end Playwright tests on Web Remote:

```sh
pnpm test:e2e
```

To run headed end-to-end Playwright tests on Web Remote:

```sh
pnpm test:e2e:headed
```

## Deployment

For deployment, see the [Deployment](deployment.md) page.

