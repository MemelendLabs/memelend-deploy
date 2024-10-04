import { task } from 'hardhat/config';
import {
  getAaveOracle,
  waitForTx,
  MockAggregator__factory,
  AaveOracle__factory,
  getAaveProtocolDataProvider,
  getPoolAddressesProvider,
  AggregatorV3Interface__factory,
  ISupraSValueFeed__factory,
  MockSupraAggregator__factory,
  SupraUsdAggregator__factory,
  SupraUsdtAggregator__factory,
} from '../../helpers';
import {
  loadPoolConfig,
  ConfigNames,
  getReserveAddresses,
} from '../../helpers/market-config-helpers';
import { getPairsTokenAggregator } from '../../helpers/init-helpers';
import { ZERO_ADDRESS } from '../../helpers/constants';
import { getChainlinkOracles } from '../../helpers/market-config-helpers';
import { MARKET_NAME } from '../../helpers/env';
import { eNetwork, ICommonConfiguration } from '../../helpers/types';
import { parseUnits } from 'ethers/lib/utils';

const ORACLE_ADDRESS = '0x8B512d4391C49300388ada23995EdbeE8bE966f6';

// npx hardhat --network neoX-testnet intersect:addAssetSource --asset 0x1CE16390FD09040486221e912B87551E4e44Ab17 --source 0xD8b3379fF7DE5d874134783870eC9cdc0820D711;
task('intersect:addAssetSource', 'Add asset source to the market')
  .addParam('asset', 'The address of asset')
  .addParam('source', 'The address of source CLA')
  .setAction(async ({ asset, source }, hre) => {
    const marketOracle = await getAaveOracle(ORACLE_ADDRESS);

    // const marketContract = await ethers.getContractAt('Market', asset, signer);
    // const res = await marketContract.addAssetSource(source);
    const res = await waitForTx(await marketOracle.setAssetSources([asset], [source]));

    console.log(res);

    console.log(`Added ${source} as asset source to ${asset}`);
  });

// npx hardhat --network neoX-testnet intersect:setAssetPrice --asset 0xc4463A7456b48500CC2a2B747C54deE0CB671B3c --price 2000000000
task('intersect:setAssetPrice', 'Deploy a mock CLA with specified price for asset')
  .addParam('asset', 'The address of asset')
  .addParam('price', 'The price of source CLA')
  .setAction(async ({ asset, price }, hre) => {
    const ethers = hre.ethers;
    const [signer] = await ethers.getSigners();

    const factory = new MockAggregator__factory(signer);
    const aggregator = await factory.deploy(price);
    await aggregator.deployed();

    const marketOracle = await getAaveOracle(ORACLE_ADDRESS);
    const res = await waitForTx(await marketOracle.setAssetSources([asset], [aggregator.address]));
    console.log(res);
    console.log(`Changed source to ${aggregator.address} for asset ${asset}`);
  });

// npx hardhat --network neoX-testnet intersect:getAssetPrice --asset 0xA40b7eCEC44B653B842177d5d5cAf0FB3D01D474
task('intersect:getAssetPrice', 'Get asset price from the market oracle')
  .addParam('asset', 'The address of asset')
  .setAction(async ({ asset }, hre) => {
    const marketOracle = await getAaveOracle(ORACLE_ADDRESS);

    const price = await marketOracle.getAssetPrice(asset);

    console.log(`Price of ${asset} is ${price}`);
  });

// npx hardhat --network neoX-testnet intersect:getBaseDetails
task('intersect:getBaseDetails', 'Get Base currency of the market').setAction(async ({}, hre) => {
  const marketOracle = await getAaveOracle(ORACLE_ADDRESS);

  const baseCurrency = await marketOracle.BASE_CURRENCY();
  const baseUnit = await marketOracle.BASE_CURRENCY_UNIT();

  console.log(`Base currency: ${baseCurrency}, Base unit: ${baseUnit}`);
});

// npx hardhat --network neoX-testnet intersect:deployBaseAggregator
task('intersect:deployBaseAggregator', 'Deploy the base currency mock aggregator').setAction(
  async ({}, hre) => {
    const ethers = hre.ethers;
    const [signer] = await ethers.getSigners();

    const factory = new MockAggregator__factory(signer);

    const aggregator = await factory.deploy('300000000');
    await aggregator.deployed();

    console.log(`Deployed base currency aggregator at ${aggregator.address}`);
  }
);

// npx hardhat --network neoX-testnet intersect:checkMockAggregator
task(
  'intersect:checkMockAggregator',
  'Query latest answer of the base currency mock aggregator'
).setAction(async ({}, hre) => {
  const ethers = hre.ethers;
  const [signer] = await ethers.getSigners();

  const factory = new MockAggregator__factory();
  const aggregator = await factory
    .connect(signer)
    .attach('0xD8b3379fF7DE5d874134783870eC9cdc0820D711');

  const price = await aggregator.latestAnswer();

  console.log(`Latest answer: ${price}`);
});

// npx hardhat --network neoX-testnet intersect:deployMarketOracle
// Deploys and migrates and existing source from old to new market oracle
task('intersect:deployMarketOracle', 'Deploy the main market oracle')
  .addParam('provider', 'The address of address provider')
  .setAction(async ({ provider }, hre) => {
    const ethers = hre.ethers;
    const [signer] = await ethers.getSigners();

    // set the new price oracle to the address provider
    const addressProvider = await getPoolAddressesProvider(provider);

    const factory = new AaveOracle__factory(signer);

    const poolConfig = await loadPoolConfig(MARKET_NAME as ConfigNames);
    // TODO: check if the loading of config works
    const network = (process.env.FORK ? process.env.FORK : hre.network.name) as eNetwork;
    const { OracleQuoteUnit } = poolConfig as ICommonConfiguration;
    console.log('ORACLE QUOTE UNIT:', OracleQuoteUnit);

    const fallbackOracleAddress = ZERO_ADDRESS;

    const dataProviderAddress = await addressProvider.getPoolDataProvider();

    const dataProvider = await getAaveProtocolDataProvider(dataProviderAddress);
    const reserveAssets = await dataProvider.getAllReservesTokens();

    const assets = [];
    const sources = [];
    // compile the reserve assets into one
    for (let i = 0; i < reserveAssets.length; i++) {
      assets.push(reserveAssets[i][0]);
    }
    console.log('RESERVE ASSETS:', assets);

    const oldOracleAddress = await addressProvider.getPriceOracle();
    const oldOracle = await getAaveOracle(oldOracleAddress);
    for (let i = 0; i < assets.length; i++) {
      const source = await oldOracle.getSourceOfAsset(assets[i]);
      sources.push(source);
    }
    console.log('SOURCES:', sources);

    const oracle = await factory.deploy(
      provider,
      assets,
      sources,
      fallbackOracleAddress,
      ZERO_ADDRESS,
      parseUnits('1', OracleQuoteUnit)
    );
    await oracle.deployed();
    console.log(`Deployed market oracle at ${oracle.address}`);

    await waitForTx(await addressProvider.setPriceOracle(oracle.address));

    console.log(`Set price oracle to the address provider`);
  });

// npx hardhat --network neoX-testnet intersect:queryChainlinkAgg --aggregator 0x99f4800f8958Caf403688b988f683188dF36CEaF
task('intersect:queryChainlinkAgg', 'Query the chainlink aggregator for a value')
  .addParam('aggregator', 'The address of the aggregator')
  .setAction(async ({ aggregator }, hre) => {
    const ethers = hre.ethers;
    const [signer] = await ethers.getSigners();

    const agg = await AggregatorV3Interface__factory.connect(aggregator, signer);

    const data = await agg.latestRoundData();
    console.log(data);
  });

// npx hardhat --network neoX-testnet intersect:supraStorage --supra 0x58e158c74DF7Ad6396C0dcbadc4878faC9e93d57 --index 44
task('intersect:supraStorage', 'Query supra storage directly for price index')
  .addParam('supra', 'The address of the supra storage')
  .addParam('index', 'The address of the supra storage')
  .setAction(async ({ supra, index }, hre) => {
    const ethers = hre.ethers;
    const [signer] = await ethers.getSigners();

    const storage = await ISupraSValueFeed__factory.connect(supra, signer);

    const data = await storage.getSvalue(index);
    console.log(data);
  });

// npx hardhat --network neoX intersect:deploySupraUsdtAggregator --asset 0xdE41591ED1f8ED1484aC2CD8ca0876428de60EfF --index 260 --pair 'wGAS10_USDT'
const SUPRA_STORAGE = '0x58e158c74DF7Ad6396C0dcbadc4878faC9e93d57';
task(
  'intersect:deploySupraUsdtAggregator',
  'Deploy adapted chainlink-supra agggregator for Intersect oracle'
)
  .addParam('asset', 'The address of the asset')
  .addParam('index', 'The token pair index')
  .addParam('pair', 'Name of the token pair')
  .setAction(async ({ asset, index, pair }, hre) => {
    const ethers = hre.ethers;
    const [signer] = await ethers.getSigners();

    // deploy the aggregator to hit the storage directly
    const factory = new SupraUsdtAggregator__factory(signer);
    const agg = await factory.deploy(asset, SUPRA_STORAGE, index, 0, 8, pair);
    await agg.deployed();

    console.log(`Deployed aggregator at ${agg.address} for ${pair}`);

    // hit the aggregator to check if works
    const data = await agg.latestAnswer();
    console.log(data);
  });

// npx hardhat --network neoX intersect:querySupraUsdtAggregator --aggregator 0x6165353FC873328316d5299b86E855B74FD83389
task(
  'intersect:querySupraUsdtAggregator',
  'Query chainlink-supra agggregator linked to Supra storage'
)
  .addParam('aggregator', 'The address of the asset')
  .setAction(async ({ aggregator }, hre) => {
    const ethers = hre.ethers;
    const [signer] = await ethers.getSigners();

    // deploy the aggregator to hit the storage directly
    const factory = new SupraUsdtAggregator__factory(signer);
    const agg = await factory.connect(signer).attach(aggregator);
    // const decimal = await agg.decimals();
    // console.log({ decimal });
    const asset = await agg.asset();
    console.log({ asset });
    const pair = await agg.tokenPair();
    console.log({ pair });
    // const pairIndex = await agg.assetPriceIndex();
    // console.log({ pairIndex });
    // hit the aggregator to check if works
    const latestAnswer = await agg.latestAnswer();
    console.log({ latestAnswer });
  });

// npx hardhat --network neoX-testnet intersect:deployMockSupraAggregator --asset 0x0cb21f4D98F16A1982Ce3e3b49C48b5b8C2126C7 --index 166 --pair 'wBTC_USDT'

// npx hardhat --network neoX-testnet intersect:deployMockSupraAggregator --asset 0x0cc42b53DFEd758027fb82103fa3C85E7044fF15 --index 211 --pair 'wETH_USDT'

// npx hardhat --network neoX-testnet intersect:deployMockSupraAggregator --asset 0xb6489C980C53583816E071005B268F2F7fD7b859 --index 44 --pair 'NEO_USDT'

// npx hardhat --network neoX-testnet intersect:deployMockSupraAggregator --asset 0x1CE16390FD09040486221e912B87551E4e44Ab17 --index 260 --pair 'GAS_USDT'

task('intersect:deployMockSupraAggregator', 'Deploy mock supra agggregator linked to Supra storage')
  .addParam('asset', 'The address of the asset')
  .addParam('index', 'The token pair index')
  .addParam('pair', 'Name of the token pair')
  .setAction(async ({ asset, index, pair }, hre) => {
    const ethers = hre.ethers;
    const [signer] = await ethers.getSigners();

    // deploy the aggregator to hit the storage directly
    const factory = new MockSupraAggregator__factory(signer);
    const agg = await factory.deploy(asset, SUPRA_STORAGE, index, 0, 8, pair);
    await agg.deployed();

    console.log(`Deployed aggregator at ${agg.address} for ${pair}`);

    // hit the aggregator to check if works
    const data = await agg.latestAnswer();
    console.log(data);
  });

// npx hardhat --network neoX-testnet intersect:queryMockSupraAggregator --aggregator 0x8aD04219f35dA083B2DbBA74358F7fC477a5a17c
task('intersect:queryMockSupraAggregator', 'Query mock supra agggregator linked to Supra storage')
  .addParam('aggregator', 'The address of the asset')
  .setAction(async ({ aggregator }, hre) => {
    const ethers = hre.ethers;
    const [signer] = await ethers.getSigners();

    // deploy the aggregator to hit the storage directly
    const factory = new MockSupraAggregator__factory(signer);
    const agg = await factory.connect(signer).attach(aggregator);
    const decimal = await agg.decimals();
    console.log({ decimal });
    const asset = await agg.asset();
    console.log({ asset });
    const pair = await agg.tokenPair();
    console.log({ pair });
    const pairIndex = await agg.assetPriceIndex();
    console.log({ pairIndex });
    // hit the aggregator to check if works
    const latestAnswer = await agg.latestAnswer();
    console.log({ latestAnswer });
  });

// npx hardhat --network neoX-testnet intersect:deployAndLinkMockSupraAggregator --asset 0xA40b7eCEC44B653B842177d5d5cAf0FB3D01D474 --index 166 --pair 'wBTC_USDT'

// npx hardhat --network neoX-testnet intersect:deployAndLinkMockSupraAggregator --asset 0x0cc42b53DFEd758027fb82103fa3C85E7044fF15 --index 211 --pair 'wETH_USDT'

// npx hardhat --network neoX-testnet intersect:deployAndLinkMockSupraAggregator --asset 0xb6489C980C53583816E071005B268F2F7fD7b859 --index 44 --pair 'NEO_USDT'

// npx hardhat --network neoX-testnet intersect:deployAndLinkMockSupraAggregator --asset 0x1CE16390FD09040486221e912B87551E4e44Ab17 --index 260 --pair 'GAS_USDT'

// npx hardhat --network neoX-testnet intersect:getAssetPrice --asset 0xA40b7eCEC44B653B842177d5d5cAf0FB3D01D474
task(
  'intersect:deployAndLinkMockSupraAggregator',
  'Deploy mock supra agggregator linked to Supra storage'
)
  .addParam('asset', 'The address of the asset')
  .addParam('index', 'The token pair index')
  .addParam('pair', 'Name of the token pair')
  .setAction(async ({ asset, index, pair }, hre) => {
    const ethers = hre.ethers;
    const [signer] = await ethers.getSigners();

    // deploy the aggregator to hit the storage directly
    const factory = new MockSupraAggregator__factory(signer);
    const agg = await factory.deploy(asset, SUPRA_STORAGE, index, 0, 8, pair);
    await agg.deployed();
    const source = agg.address;
    console.log(`Deployed aggregator at ${source} for ${pair}`);

    const marketOracle = await getAaveOracle(ORACLE_ADDRESS);
    // const marketContract = await ethers.getContractAt('Market', asset, signer);
    // const res = await marketContract.addAssetSource(source);
    const res = await waitForTx(await marketOracle.setAssetSources([asset], [source]));

    console.log(res);

    console.log(`Added ${source} as asset source to ${asset}`);

    const marketData = await marketOracle.getAssetPrice(asset);
    console.log(`Oracle value ${marketData}`);

    const supra = '0x5df499C9DB456154F81121282c0cB16b59e74C4b';
    const storage = await ISupraSValueFeed__factory.connect(supra, signer);

    const data = await storage.getSvalue(index);
    console.log(`Supra storage ${data}`);
  });

// TODO: Task to set all the sources of assets to the new chianLinkInterface
