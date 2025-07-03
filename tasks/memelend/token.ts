import { task } from 'hardhat/config';
import {
  StableDebtToken__factory,
  AToken__factory,
  VariableDebtToken__factory,
  WrappedTokenGatewayV3__factory,
  waitForTx,
  MintableERC20__factory,
  MockChainlinkAggregator__factory,
} from '../../helpers';
import { ZERO_ADDRESS } from '../../helpers/constants';

const POOL_ADDRESS = '0xf7c9d3Ad727527D2D19138C56b087c9f3a5f6D2a';
const POOL_ADDRESS_PROVIDER = '0x37EC7775993A2Ac8197ed5173eDDC8FB0cb3f0b6';

// npx hardhat --network memecore-testnet memelend:deployTokenImplementations
task('memelend:deployTokenImplementations', 'Deploy debt token implementations').setAction(
  async ({}, hre) => {
    const ethers = hre.ethers;
    const [signer] = await ethers.getSigners();

    const stableDebtTokenFactory = new StableDebtToken__factory(signer);
    const aTokenFactory = new AToken__factory(signer);
    const variableDebtTokenFactory = new VariableDebtToken__factory(signer);

    const stableDebtToken = await stableDebtTokenFactory.deploy(POOL_ADDRESS);
    await stableDebtToken.deployed();

    await waitForTx(
      await stableDebtToken.initialize(
        POOL_ADDRESS, // initializingPool
        ZERO_ADDRESS, // underlyingAsset
        ZERO_ADDRESS, // incentivesController
        0, // debtTokenDecimals
        'STABLE_DEBT_TOKEN_IMPL', // debtTokenName
        'STABLE_DEBT_TOKEN_IMPL', // debtTokenSymbol
        '0x00' // params
      )
    );
    console.log(`Deployed stable debt token at ${stableDebtToken.address}`);

    const aToken = await aTokenFactory.deploy(POOL_ADDRESS);
    await aToken.deployed();
    await waitForTx(
      await aToken.initialize(
        POOL_ADDRESS, // initializingPool
        ZERO_ADDRESS, // treasury
        ZERO_ADDRESS, // underlyingAsset
        ZERO_ADDRESS, // incentivesController
        0, // aTokenDecimals
        'ATOKEN_IMPL', // aTokenName
        'ATOKEN_IMPL', // aTokenSymbol
        '0x00' // params
      )
    );
    console.log(`Deployed A token at ${aToken.address}`);

    const variableDebtToken = await variableDebtTokenFactory.deploy(POOL_ADDRESS);
    await variableDebtToken.deployed();
    await waitForTx(
      await variableDebtToken.initialize(
        POOL_ADDRESS, // initializingPool
        ZERO_ADDRESS, // underlyingAsset
        ZERO_ADDRESS, // incentivesController
        0, // debtTokenDecimals
        'VARIABLE_DEBT_TOKEN_IMPL', // debtTokenName
        'VARIABLE_DEBT_TOKEN_IMPL', // debtTokenSymbol
        '0x00' // params
      )
    );
    console.log(`Deployed variable debt token at ${variableDebtToken.address}`);

    console.log('====== Deployed all debt tokens ======');
    console.log('A_TOKEN_ADDRESS=', aToken.address);
    console.log('STABLE_TOKEN_ADDRESS=', stableDebtToken.address);
    console.log('VARIABLE_TOKEN_ADDRESS=', variableDebtToken.address);
  }
);

const WRAPPED_TOKEN_ADDRESS = '0x1CE16390FD09040486221e912B87551E4e44Ab17';

// npx hardhat --network memecore-testnet memelend:deployWrappedTokenGateway
task('memelend:deployWrappedTokenGateway', 'Deploy wrapped token gateway').setAction(
  async ({}, hre) => {
    const ethers = hre.ethers;
    const [signer] = await ethers.getSigners();

    const gatewayFactory = new WrappedTokenGatewayV3__factory(signer);
    const gateway = await gatewayFactory.deploy(
      WRAPPED_TOKEN_ADDRESS,
      signer.address,
      POOL_ADDRESS
    );

    await gateway.deployed();
    console.log(`Deployed wrapped token gateway at ${gateway.address}`);
  }
);

// npx hardhat --network memecore-testnet memelend:deployTestToken
task('memelend:deployTestToken', 'Deploy test token').setAction(async ({}, hre) => {
  const ethers = hre.ethers;
  const [signer] = await ethers.getSigners();
  console.log(signer.address);

  const tokenFactory = new MintableERC20__factory(signer);
  const token = await tokenFactory.deploy('TestToken', 'TEST', 18);

  await token.deployed();
  console.log(`Deployed test token at ${token.address}`);
});

// npx hardhat --network memecore-testnet memelend:deployMockChainlinkAggregator
task('memelend:deployMockChainlinkAggregator', 'Deploy mock chainlink aggregator').setAction(
  async ({}, hre) => {
    const ethers = hre.ethers;
    const [signer] = await ethers.getSigners();

    const oracleFactor = new MockChainlinkAggregator__factory(signer);

    const tokenAddress = '0x6165353FC873328316d5299b86E855B74FD83389';
    const price = BigInt(1e18);
    const oracle = await oracleFactor.deploy(tokenAddress, price, 18, 'TEST/USD');
    await oracle.deployed();
    const checkPrice = await oracle.latestAnswer();

    console.log(`Deployed test token oracle at ${oracle.address}`);
    console.log(`Token price is ${checkPrice.toString()}`);
  }
);

// npx hardhat --network memecore-testnet memelend:deployTestTokenWithOracle --token-name "Wrapped M" --token-symbol "VM" --token-decimals 18 --token-price 100e8
task('memelend:deployTestTokenWithOracle', 'Deploy test token with oracle')
  .addParam('tokenName', 'The name of the token')
  .addParam('tokenSymbol', 'The symbol of the token')
  .addParam('tokenDecimals', 'The decimal of the token')
  .addParam('tokenPrice', 'The price of the token')
  .setAction(async ({ tokenName, tokenPrice, tokenSymbol, tokenDecimals }, hre) => {
    const ethers = hre.ethers;
    const [signer] = await ethers.getSigners();

    const decimals = BigInt(tokenDecimals);
    const tokenFactory = new MintableERC20__factory(signer);
    const token = await tokenFactory.deploy(tokenName, tokenSymbol, decimals);
    await token.deployed();
    console.log(`Deployed test token at ${token.address}`);

    const oracleFactory = new MockChainlinkAggregator__factory(signer);
    const price = BigInt(tokenPrice);
    const pair = `${tokenSymbol}/USD`;
    const oracle = await oracleFactory.deploy(token.address, price, decimals, pair);
    await oracle.deployed();
    const checkPrice = await oracle.latestAnswer();

    console.log(`Deployed test token oracle at ${oracle.address}`);
    console.log(`Token price is ${checkPrice.toString()}`);
  });

// npx hardhat --network memecore-testnet memelend:checkChainlinkAggregator
task('memelend:checkChainlinkAggregator', 'Check price of mock chainlink aggregator').setAction(
  async ({}, hre) => {
    const ethers = hre.ethers;
    const [signer] = await ethers.getSigners();

    const oracleFactory = new MockChainlinkAggregator__factory();

    const aggregator = '0xB28F39BDba7feD13c7e5FB050881bfA6b49eBf3b';
    const oracle = oracleFactory.connect(signer).attach(aggregator);

    const checkPrice = await oracle.latestAnswer();
    const pair = await oracle.tokenPair();

    console.log(`Token pair is ${pair}`);
    console.log(`Token price is ${checkPrice.toString()}`);
  }
);
