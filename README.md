<img src="https://www.elasticpath.com/themes/custom/bootstrap_sass/logo.svg" alt="" width="400" />

# Elastic Path Commerce Cloud JavaScript SDK 

[![npm version](https://img.shields.io/npm/v/@elasticpath/js-sdk.svg)](https://www.npmjs.com/package/@elasticpath/js-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/elasticpath/js-sdk/issues)
[![follow on Twitter](https://img.shields.io/twitter/follow/elasticpath?style=social&logo=twitter)](https://twitter.com/intent/follow?screen_name=elasticpath)

> [!IMPORTANT]  
> This repository has been migrated from [@moltin/sdk](https://www.npmjs.com/package/@moltin/sdk). If you are a previous user of the Moltin SDK, read our [guide](MIGRATION_GUIDE.md) to learn more about migrating your implementation to this codebase  

A simple to use API interface to help get you off the ground quickly and efficiently with your Elastic Path Commerce Cloud JavaScript apps.

📚 [API reference](https://documentation.elasticpath.com/commerce-cloud/docs/developer/get-started/sdk.html#officially-supported-sdk) &mdash; 📚 [Elastic Path Commerce Cloud](https://www.elasticpath.com)

## 🛠 Installation

Install the package from [npm](https://www.npmjs.com/package/@elasticpath/js-sdk) and import in your project.

```bash
npm install --save @elasticpath/js-sdk
```

## ⛽️ Usage

To get started, instantiate a new Elastic Path client with your store credentials.


> [!NOTE]  
> This requires an [Elastic Path Commerce Cloud](https://www.elasticpath.com) account. You can sign up for a free trial [here](https://cm.elasticpath.com/free-trial)


```js
// JavaScript
import { gateway as ElasticPathGateway } from '@elasticpath/js-sdk'

const ElasticPath = ElasticPathGateway({
  client_id: 'XXX'
})

// Node.js
const ElasticPathGateway = require('@elasticpath/js-sdk').gateway

const ElasticPath = ElasticPathGateway({
  client_id: 'XXX',
  client_secret: 'XXX'
})
```

Alternatively you can include the `UMD` bundle via [UNPKG](https://unpkg.com) like so:

``` html
<script src="https://unpkg.com/@elasticpath/js-sdk"></script>

<script>
  const ElasticPath = elasticpath.gateway({
    client_id: 'XXX'
  });
</script>
```

> **Note:** If you're using [webpack](https://webpack.github.io), you'll need to add the following to your projects configuration file.

```js
node: {
  fs: 'empty'
}
```

You can now authenticate with the ElasticPath service 🎉

```js
ElasticPath.Authenticate().then(response => {
  console.log('authenticated', response)
})
```

Check out the [API reference](https://elasticpath.dev/docs/commerce-cloud) to learn more about authenticating and the available endpoints.

### Custom Host

If you're an enterprise customer with your own infrastructure, you'll need to specify your API URL when instantiating:

```js
const ElasticPath = ElasticPathGateway({
  client_id: 'XXX',
  host: 'api.yourdomain.com'
})
```

### Custom Storage

By default the Elastic Path Commerce Cloud SDK persists data to `window.localStorage` in the browser and `node-localstorage` in Node. If this doesn't suit your needs you can override the default storage with a `MemoryStorageFactory` which will persist data for the life cycle of the JavaScript VM:

```js
import { gateway as ElasticPathGateway, MemoryStorageFactory } from '@elasticpath/js-sdk'

const ElasticPath = ElasticPathGateway({
  client_id: 'XXX',
  storage: new MemoryStorageFactory()
})
```

Or alternatively, create your own storage factory by passing in an object which implements the following interface:

```js
interface StorageFactory {
  set(key: string, value: string): void;
  get(key: string): string | null;
  delete(key: string): void;
}
```

### Multiple Gateways

You can support multiple gateways with a `name` property when initializing the gateway.

`name` should be unique to avoid sharing storage keys with the other gateways of the same name.

```js
import { gateway as EPCCGateway } from "@elasticpath/js-sdk"

const gatewayOne = EPCCGateway({
    name: "my-first-gateway",
    client_id: 'XXX'
})

const gatewayTwo = EPCCGateway({
    name: "my-second-gateway",
    client_id: 'XXX'
})
```

Storage keys used for storage solutions are prefixed with the name provided and end with the relevant feature e.g.
`my-first-gateway_ep_cart`, `my-first-gateway_ep_credentials` and `my-first-gateway_ep_currency`.

If no name property is provided to the EPCCGateway function, the legacy naming is maintained:
`mcart`, `epCredentials` and `mcurrency`

### Included Headers

There are currently several optional headers you can pass into the configuration, which include `application`, `language` and `currency`.

You can pass them into the config used by the gateway like this:

``` TypeScript
// JavaScript
import { gateway as ElasticPathGateway } from '@elasticpath/js-sdk'
// const ElasticPathGateway = require('@elasticpath/js-sdk').gateway -> for Node

const ElasticPath = ElasticPathGateway({
    client_id: 'XXX',
    client_secret: 'XXX'
    currency: 'YEN',
    language: 'en',
    application: 'my-app'
})
```

### Retries

In case the server responds with status 429 - "Too Many Requests" SDK will wait for some time and retry the same API request up to a given number of times.
You can fine tune this logic through following config parameters:

``` TypeScript
const ElasticPath = ElasticPathGateway({
    client_id: 'XXX',
    client_secret: 'XXX',
    retryDelay: 1000,
    retryJitter: 500,
    fetchMaxAttempts: 4
})

```

In case of a 429 response SDK will wait for `retryDelay` milliseconds (default 1000) before attempting to make the same call.
If the server responds with 429 again it will wait for 2 * `retryDelay` ms, then 3 * `retryDelay` ms and so on.
On top of that the random value between 0 and `retryJitter` (default 500) will be added to each wait.
This would repeat up to `fetchMaxAttempts` (default 4) times.

### Throttling (Rate Limiting)

SDK supports throttling through use of `throttled-queue` library.
Unlike the throttle functions of popular libraries, `throttled-queue` will not prevent any executions.
Instead, every execution is placed into a queue, which will be drained at the desired rate limit.
You can control throttling through following parameters:

``` TypeScript
const ElasticPath = ElasticPathGateway({
    client_id: 'XXX',
    client_secret: 'XXX',
    throttleEnabled: true,
    throttleLimit: 3,
    throttleInterval: 125
})

```

This feature is disabled by default and to enable it you need to set `throttleEnabled` to true.
Once enabled you can use `throttleLimit` (default 3) and `throttleInterval` (default 125) to define what is the maximum number of calls per interval.
For example setting `throttleLimit = 5, throttleInterval = 1000` means maximum of 5 calls per second.

### Handling File Upload

Files can be uploaded to the EPCC file service with the `ElasticPath.Files.Create` method. You should pass a `FormData` object as described in the [documentation](https://documentation.elasticpath.com/commerce-cloud/docs/api/advanced/files/create-a-file.html#post-create-a-file 'documentation').

In a Node.js environment, where you may be using an alternative `FormData` implementation, you can include a second parameter to represent the `Content-Type` header for the request. This must be `multipart/form-data` and must include a `boundary`. For example, using the `form-data` [package](https://www.npmjs.com/package/form-data 'package'):

``` TypeScript
const FormData = require('form-data')
const formData = new FormData()
formData.append('file', buffer)

const contentType = formData.getHeaders()['content-type']

ElasticPath.Files.Create(formData, contentType)
```

#### Referencing a file stored elsewhere

If you want to create a file by simply [referencing](https://documentation.elasticpath.com/commerce-cloud/docs/api/advanced/files/create-a-file.html#post-create-a-file 'referencing') a file stored elsewhere, you can use this helper method:

``` TypeScript
ElasticPath.Files.Link('https://cdn.external-host.com/files/filename.png')
```

Just pass the URL to the `Link` method and creation will be handled for you.

### TypeScript Support

The Elastic Path Commerce Cloud JavaScript SDK is fully supported in Typescript.

Imported module will contain all interfaces needed to consume backend services. i.e:

```TypeScript
import * as elasticpath from '@elasticpath/js-sdk';

const product: elasticpath.ProductBase = {...}
```

If you do not want to use the namespace, you can extend the interfaces and define them yourself, like so:

```TypeScript
// You can name the interface anything you like
interface Product extends product.ProductBase {
}

const product: Product = {...}
```

Here is an example of a simple product creation:

```TypeScript
import { ElasticPath, gateway, ProductBase, Resource } from '@elasticpath/js-sdk';

async function main() {
  const g: ElasticPath = gateway({client_id, client_secret});
  const auth = await g.Authenticate();

  const newProduct: ProductBase = {
    type: "product",
    name: "My Product",
    slug: "my-prod",
    sku: "my-prod",
    manage_stock: false,
    description: "Some description",
    status: "draft",
    commodity_type: "physical",
    price: [
      {
        amount: 5499,
        currency: "USD",
        includes_tax: true
      }
    ]
  };

  const nP: Resource<Product> = await g.Products.Create(newProduct);
}
```

You can also extend any base interface compatible with flows to create any custom interfaces that you might be using by re-declaring `@elasticpath/js-sdk` module. Following example adds several properties to `ProductsBase` interface that correspond to flows added to the backend.

In your project add a definition file (with a `.d.ts` extension) with a following code:

```TypeScript
import * as elasticpath from '@elasticpath/js-sdk';

declare module '@elasticpath/js-sdk' {

  interface Weight {
    g: number;
    kg: number;
    lb: number;
    oz: number;
  }

  interface ProductBase {
    background_color: string;
    background_colour: string | null;
    bulb: string;
    bulb_qty: string;
    finish: string;
    material: string;
    max_watt: string;
    new: string | null;
    on_sale: string | null;
    weight: Weight;
  }

}
```

This will affect base interface and all other Product interfaces that inherit from base interface so added properties will be present when creating, updating, fetching products.

## ❤️ Contributing

We love community contributions. Here's a quick guide if you want to submit a pull request:

1.  Fork the repository
2.  Add a test for your change (it should fail)
3.  Make the tests pass
4.  Commit your changes (see note below)
5.  Submit your PR with a brief description explaining your changes 

> **Note:** Commits should adhere to the [Angular commit conventions](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#-git-commit-guidelines).

Make sure you have [Prettier](https://prettier.io) installed for your editor with ESLint integration enabled.

## ⚡️ Development

The SDK is built with [ES6 modules](https://strongloop.com/strongblog/an-introduction-to-javascript-es6-modules/) that are bundled using [Rollup](http://rollupjs.org).

If you want to roll your own bundle, or make changes to any of the modules in `src`, then you'll need to install the package dependencies and run rollup while watching for changes.

```
npm install
npm start
```

To run test

```
npm test
```

You can learn more about the Rollup API and configuration [here](https://github.com/rollup/rollup/wiki).

## Terms And Conditions

- Any changes to this project must be reviewed and approved by the repository owner.
- For more information about the license, see [MIT License](https://github.com/elasticpath/js-sdk/blob/main/LICENSE).  