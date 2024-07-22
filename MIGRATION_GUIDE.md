# Migration Guide: @moltin/sdk to @elasticpath/js-sdk

## Background and rationale

The Elastic Path Commerce Cloud JavaScript SDK has been migrated from `@moltin/sdk` to `@elasticpath/js-sdk`. This was an overdue change, and will allow us to consolidate our version control usage behind the @elasticpath namespace. 

We are also taking this opportunity to entirely remove legacy naming (moltin) from the codebase to avoid confusion.

## Key Changes

- **Package Name**: The package name has changed from `@moltin/sdk` to `@elasticpath/js-sdk`.
- **GitHub Repository**: The GitHub repository has moved from `moltin/js-sdk` to `elasticpath/js-sdk`.

> [!NOTE]
> We are aligning the package name with the repository name, i.e. `js-sdk`, rather than just `sdk`. We are reserving the `sdk` name for future use.

## Installation

### Old Package Installation

```bash
npm install --save @moltin/sdk
```

### New Package Installation

Replace the old package with the new one:

```bash
npm install --save @elasticpath/js-sdk
```

## Example Usage

### Importing the SDK

#### Old Usage

```js
import { gateway as MoltinGateway } from '@moltin/sdk'

const Moltin = MoltinGateway({
  client_id: 'XXX'
})
```

#### New Usage


```js
import { gateway as ElasticPathGateway } from '@elasticpath/js-sdk'

const ElasticPath = ElasticPathGateway({
  client_id: 'XXX'
})
```

### Migration

1. **Change the import path**: Update all occurrences of `@moltin/sdk` to `@elasticpath/js-sdk`.
2. **Rename the import alias**: If you are using `MoltinGateway`, change it to `ElasticPathGateway` (or a name of your choice).
3. **Update instance names**: Rename any instances of `Moltin` to `ElasticPath` to maintain consistency and clarity in your codebase.

If you are directly accessing any of the state the SDK persists in localStorage or cookies, **update your references** like so:

- **mcart** becomes **epcart**
- **mcurrency** becomes **epcurrency**
- **moltinCredentials** becomes **epCredentials**

> [!CAUTION]
> Accessing this SDK state directly is **not recommended**

The compiled SDK and types published in `/dist` as `moltin.cjs.js`, `moltin.d.ts`, `moltin.esm.js`, and `moltin.js` are now published as `index`
