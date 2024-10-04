# Deployment of Intersect Market on Mainnet

## Overview

### Network Configuration

### Market Configuration

Use the deployment scripts to deploy the Intersect Market on Mainnet.
Ensure that the follow files in the `markets/intersect` directory are updated with the correct details:

1. Index.ts
   Correct common market configuration parameters such as MarketId, token prefix, symbol prefix, reserve asset addresses (underlying asset address), reserve configuration (asset strategy).
   ReserveConfig - set the correct asset strategy and configuration define in reserveConfige.ts for the corresponding asset.
   ReserveAssets - list the assets to the corresponding underlying token address.

   \*\* Both list will need to correspond to each other as after-deploy will attempt to setup the resservce configuration from the given strategy and asset address.

2. Commons.ts
   ChainlinkAggregator - link the correct asset to the aggregator address.
   eMode - add in the eMode name and params with the associated assets in the category. If the assets are not listed in Index.ts, do not add them into eMode as setup of eMode will fail.

3. RateStrategies.ts
   Add all relevant rate strategies for the market, if there is any.
   Values are in ratio format where 8000 bps is 80% and 0.8 on the configuration params.

4. ReservesConfig.ts
   Add in the reserves to be listed with the associated strategy.
   Ensure stableBorrowRateEnabled is set to false as

5. Constants.ts
   Make sure that the POOL_ADMIN is updated to the correct address in the `markets/intersect/Constants.ts` file.

````bash

## Deployment of Intersect Aggregators

Get the correct SUPRA STORAGE contract address and set it in the `tasks/intersect/marketOracle.ts` file.

```bash
const SUPRA_STORAGE = '0x58e158c74DF7Ad6396C0dcbadc4878faC9e93d57';
````

1. Deploy the Intersect Aggregators by running the following command:
   Get the correct data feed index which can be found on the Supra website, https://docs.supra.com/oracles/data-feeds/data-feeds-index.
   Asset address is the address of the underlying asset that the aggregator will report the price for.

```bash
// Deployment of aggregator
npx hardhat --network neoX intersect:deploySupraUsdtAggregator --asset 0xdE41591ED1f8ED1484aC2CD8ca0876428de60EfF --index 260 --pair 'wGAS10_USDT'

// Check that the aggregator returns correct values
npx hardhat --network neoX intersect:querySupraUsdtAggregator --aggregator 0x6165353FC873328316d5299b86E855B74FD83389
```

2. Linking of aggregator to Intersect Market Oracle

Asset is the address of the underlying asset that the aggregator will report the price for.
Source is the aggregator address which the market oracle will query for the price.

```bash
npx hardhat --network neoX intersect:addAssetSource --asset 0x1CE16390FD09040486221e912B87551E4e44Ab17 --source 0xD8b3379fF7DE5d874134783870eC9cdc0820D711;
```

## Common Errors

1. If the deploy script fails due to "HH701: There are multiple artifacts for contract "InitializableAdminUpgradeabilityProxy", please use a fully qualified name.". Change the contrract specified to the full path to the contract artifact as such '@aave/core-v3/contracts/dependencies/openzeppelin/upgradeability/InitializableAdminUpgradeabilityProxy.sol:InitializableAdminUpgradeabilityProxy'.

2. During a failed deployment, the script will pull artifacts and will not double deploy unnecessarily. However, if redeployment is required clear away cache and artifacts folder.

3. When the deployment fails halfway, some parts of the script does not identify a re-run and will attempt some actions that cannot be repeated such as re-initializing implementation contracts. To resolve this, just manually comment out the initialization step of the affect contract. Main culprit would be pool implementation in '01a_pool_implementation.ts'.
