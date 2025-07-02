## Adding New Assets

Deployment keys and networks configurations on hardhat.config.ts etc, is another monster that I will populate the details for later.

````shell

### Tasks under marketOracle.ts

0. Set the correct contract details within the tasks code using the details above.

```shell
const ORACLE_ADDRESS = '0x186dfb689CA6E4F85716B7a187a25cA4d2E6fBaA';
const SUPRA_STORAGE = '0x58e158c74DF7Ad6396C0dcbadc4878faC9e93d57';
````

1. Find the details for the market oracle contract (AaveOracle)
2. Find the Supra PriceFeed index for the asset and verify the asset pricing from the SupraStorage contract

```shell
https://docs.supra.com/oracles/data-feeds/data-feeds-index
npx hardhat --network memecore memelend:supraStorage --supra 0x58e158c74DF7Ad6396C0dcbadc4878faC9e93d57 --index 44
```

3. Deploy the SupraUsdtAggregator so that AaveOracle can interface and pull the asset pricing. Check the price feed good from aggregator.

```shell
npx hardhat --network memecore memelend:deploySupraUsdtAggregator --asset 0xc28736dc83f4fd43d6fb832Fd93c3eE7bB26828f --index 44 --pair 'NEO_USDT'
npx hardhat --network memecore memelend:querySupraUsdtAggregator --aggregator 0xfCd51732168F47686fC8E1422c80D40438fC84cC
```

4. Set the asset price source on the AaveOracle contract and verify source.

```shell
npx hardhat --network memecore memelend:setAssetSources --asset 0xc28736dc83f4fd43d6fb832Fd93c3eE7bB26828f --source 0xfCd51732168F47686fC8E1422c80D40438fC84cC
npx hardhat --network memecore memelend:getSourceOfAsset --asset 0xc28736dc83f4fd43d6fb832Fd93c3eE7bB26828f
```

5. Verify the asset pricing on the AaveOracle contract

```shell
npx hardhat --network memecore memelend:getAssetPrice --asset 0xc28736dc83f4fd43d6fb832Fd93c3eE7bB26828f
```

### Tasks under token.ts

6. Deploy the required token contracts for the ATokens implementation if not already done. Else pull the details from above. AToken-memelend, StableDebtToken-memelend and VariableDebtToken-memelend.

```shell
## Set the correct pool details within the tasks code using the details above.
const POOL_ADDRESS = '0xf7c9d3Ad727527D2D19138C56b087c9f3a5f6D2a'; // Pool proxy address
const POOL_ADDRESS_PROVIDER = '0x37EC7775993A2Ac8197ed5173eDDC8FB0cb3f0b6'; // Pool address provider

npx hardhat --network memecore memelend:deployTokenImplementations

```

### Tasks under reserverConfiguration.ts

7. Initialize the reserve configuration for the asset on the Pool contract.

```ts
const POOL_ADDRESS_PROVIDER = '0x37EC7775993A2Ac8197ed5173eDDC8FB0cb3f0b6';

// All the asset details need to filled
const A_TOKEN_IMPL = '0x2363eFbb94b77E16DF25722E23E0d30f6DfCf5DA'; // AToken - memelend
const STABLE_TOKEN_IMPL = '0x4F7C055019De31A6DCF6Bb38661EF0083df3Feb4'; // StableDebtToken-memelend
const VARIABLE_TOKEN_IMPL = '0x7F7F3D9A85540678C082f904B989537f3838631a'; // VariableDebtToken-memelend
const STRATEGY_ADDRESS = '0xB503A122A40eb57FD28d545fd19d0111B060d896'; // Rate strategy folling the one listed in the sheets
const UNDERLYING_ADDRESS = '0xc28736dc83f4fd43d6fb832Fd93c3eE7bB26828f';
const UNDERLYING_NAME = 'NEO';
const UNDERLYING_DECIMALS = '18';
const TREASURY_ADDRESS = '0x35e2d4fe70bbe3cBf3De0B270957BdCBC8f69285'; // Treasury proxy
const INCENTIVES_ADDRESS = '0x19789F2043C9845bcE7fb71B2358763247d32B61'; // Incentives proxy

npx hardhat --network memecore memelend:initReserve
```

8. Run the configuration task to set the reserve configuration accordingly to the sheets details. The reserve configuration params need to follow a set of validation which are already checked for in the task.

```js
// NOTE: All configuration params are in bps, and string the numbers
const LTV = '5000';
const LIQUIDATION_THRESHOLD = '6000';
const LIQUIDATION_BONUS = '10300'; // on the spreadsheet this is 103% but it should be 10300bps
const RESERVE_FACTOR = '1000';
const BORROW_CAP = '100000';
const SUPPLY_CAP = '100000';
const BORROWING_ENABLED = true;
const STABLE_BORROWING_ENABLED = false; // this should always be false
const FLASH_LOAN_ENABLED = true;

npx hardhat --network memecore memelend:setReserveConfiguration
```

9. Get the reserve details from the Pool contract and populate the details of the token addresses in the [memelend Notion](https://www.notion.so/switcheo/memelend-d3643bb398674862be42c07b76cd054b?pvs=4).

```shell
npx hardhat --network memecore memelend:getReserveFromPool --asset 0xc28736dc83f4fd43d6fb832Fd93c3eE7bB26828f
```
