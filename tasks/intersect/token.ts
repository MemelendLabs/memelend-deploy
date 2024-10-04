import { task } from 'hardhat/config';
import {
  StableDebtToken__factory,
  AToken__factory,
  VariableDebtToken__factory,
  WrappedTokenGatewayV3__factory,
  waitForTx,
} from '../../helpers';
import { ZERO_ADDRESS } from '../../helpers/constants';

const POOL_ADDRESS = '0x136B5549273715202D400e1a0E9b7A8fD5eB0842';
const POOL_ADDRESS_PROVIDER = '0x108fFADF2cA68c1b274CD5193454C33e9eBba7A4';

// npx hardhat --network neoX-testnet intersect:deployTokenImplementations
task('intersect:deployTokenImplementations', 'Deploy debt token implementations').setAction(
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

// npx hardhat --network neoX-testnet intersect:deployWrappedTokenGateway
task('intersect:deployWrappedTokenGateway', 'Deploy wrapped token gateway').setAction(
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
