import { task } from 'hardhat/config';

import { BigNumberish } from 'ethers';
import {
  waitForTx,
  getPoolAddressesProvider,
  getPoolConfiguratorProxy,
  IInterestRateStrategyParams,
  IReserveParams,
} from '../../helpers';
import { DefaultReserveInterestRateStrategy__factory, MintableERC20__factory } from '../../helpers';

const POOL_ADDRESS_PROVIDER = '0x37EC7775993A2Ac8197ed5173eDDC8FB0cb3f0b6';

// USE THIS TO INITIALIZE A RESERVE
const A_TOKEN_IMPL = '0x2363eFbb94b77E16DF25722E23E0d30f6DfCf5DA'; // AToken - memelend
const STABLE_TOKEN_IMPL = '0x4F7C055019De31A6DCF6Bb38661EF0083df3Feb4'; // StableDebtToken-memelend
const VARIABLE_TOKEN_IMPL = '0x7F7F3D9A85540678C082f904B989537f3838631a'; // VariableDebtToken-memelend
const UNDERLYING_ADDRESS = '0xc28736dc83f4fd43d6fb832Fd93c3eE7bB26828f';
const UNDERLYING_NAME = 'NEO';
const UNDERLYING_DECIMALS = '18';
const TREASURY_ADDRESS = '0x35e2d4fe70bbe3cBf3De0B270957BdCBC8f69285'; // Treasury proxy
const INCENTIVES_ADDRESS = '0x19789F2043C9845bcE7fb71B2358763247d32B61'; // Incentives proxy
const STRATEGY_ADDRESS = '0xB503A122A40eb57FD28d545fd19d0111B060d896'; // Rate strategy folling the one listed in the sheets

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

const TOKEN_NAME = 'memelend ' + UNDERLYING_NAME;
const TOKEN_SYMBOL = 'aIn' + UNDERLYING_NAME;
const VAR_TOKEN_NAME = 'memelend Variable Debt ' + UNDERLYING_NAME;
const VAR_TOKEN_SYMBOL = 'variableDebtIn' + UNDERLYING_NAME;
const STABLE_TOKEN_NAME = 'memelend Stable Debt ' + UNDERLYING_NAME;
const STABLE_TOKEN_SYMBOL = 'stableDebtIn' + UNDERLYING_NAME;

// npx hardhat --network memecore-testnet memelend:initReserve
task('memelend:initReserve', 'Initialize reserve').setAction(async ({}, hre) => {
  const poolAddressProvider = await getPoolAddressesProvider(POOL_ADDRESS_PROVIDER);
  const configuratorAddr = await poolAddressProvider.getPoolConfigurator();
  const configurator = await getPoolConfiguratorProxy(configuratorAddr);

  // if the underlying is not specified it needs to be deployed this is mainely for testing
  let underlyingAsset = UNDERLYING_ADDRESS;
  // if (underlyingAsset == '') {
  //   console.log('deploying underlying asset');
  //   const ethers = hre.ethers;
  //   const [signer] = await ethers.getSigners();
  //   const tokenFactory = new MintableERC20__factory(signer);
  //   const tokenInstance = await tokenFactory.deploy(
  //     UNDERLYING_NAME,
  //     UNDERLYING_NAME,
  //     UNDERLYING_DECIMALS
  //   );
  //   await tokenInstance.deployed();
  //   underlyingAsset = tokenInstance.address;
  //   console.log(`deployed underlying asset at ${underlyingAsset}`);
  // }

  const reserveParams: ReserveInitParams = {
    aTokenImpl: A_TOKEN_IMPL,
    stableDebtTokenImpl: STABLE_TOKEN_IMPL,
    variableDebtTokenImpl: VARIABLE_TOKEN_IMPL,
    underlyingAssetDecimals: UNDERLYING_DECIMALS,
    interestRateStrategyAddress: STRATEGY_ADDRESS,
    underlyingAsset: underlyingAsset,
    treasury: TREASURY_ADDRESS,
    incentivesController: INCENTIVES_ADDRESS,
    underlyingAssetName: UNDERLYING_NAME,
    aTokenName: TOKEN_NAME,
    aTokenSymbol: TOKEN_SYMBOL,
    variableDebtTokenName: VAR_TOKEN_NAME,
    variableDebtTokenSymbol: VAR_TOKEN_SYMBOL,
    stableDebtTokenName: STABLE_TOKEN_NAME,
    stableDebtTokenSymbol: STABLE_TOKEN_SYMBOL,
    params: '0x10',
  };

  const initReserveTx = await waitForTx(await configurator.initReserves([reserveParams]));

  console.log('Reserve initialized');
  console.log(initReserveTx);
  console.log('Please run the reserve configuration task to set the reserve configuration');
});

// Reserve Config Input parameters
interface InputParams {
  asset: string;
  baseLTV: BigNumberish;
  liquidationThreshold: BigNumberish;
  liquidationBonus: BigNumberish;
  reserveFactor: BigNumberish;
  borrowCap: BigNumberish;
  supplyCap: BigNumberish;
  stableBorrowingEnabled: boolean;
  borrowingEnabled: boolean;
  flashLoanEnabled: boolean;
}
[];

const HUNDRED_PERCENT_BPS = '10000';

// npx hardhat --network memecore-testnet memelend:setReserveConfiguration
task('memelend:setReserveConfiguration', 'Set reserve configuration for the asset').setAction(
  async ({}, hre) => {
    const ethers = hre.ethers;

    const poolAddressProvider = await getPoolAddressesProvider(POOL_ADDRESS_PROVIDER);
    const configuratorAddr = await poolAddressProvider.getPoolConfigurator();
    const configurator = await getPoolConfiguratorProxy(configuratorAddr);

    const reserveParam: InputParams = {
      asset: UNDERLYING_ADDRESS,
      baseLTV: LTV,
      liquidationThreshold: LIQUIDATION_THRESHOLD,
      liquidationBonus: LIQUIDATION_BONUS,
      reserveFactor: RESERVE_FACTOR,
      borrowCap: BORROW_CAP,
      supplyCap: SUPPLY_CAP,
      borrowingEnabled: BORROWING_ENABLED,
      stableBorrowingEnabled: STABLE_BORROWING_ENABLED,
      flashLoanEnabled: FLASH_LOAN_ENABLED,
    };

    // validations
    if (ethers.BigNumber.from(reserveParam.baseLTV).gt(reserveParam.liquidationThreshold)) {
      console.log('baseLTV needs to be less than liquidation threshold');
      return;
    }

    if (ethers.BigNumber.from(reserveParam.liquidationBonus).lte(HUNDRED_PERCENT_BPS)) {
      console.log('liquidation bonus needs to be more than 100% (10000bps)');
      return;
    }
    const bonusInPercentage = ethers.BigNumber.from(reserveParam.liquidationBonus).div(
      ethers.BigNumber.from(HUNDRED_PERCENT_BPS)
    );
    const threshold = ethers.BigNumber.from(reserveParam.liquidationThreshold).mul(
      bonusInPercentage
    );
    if (threshold.gt(HUNDRED_PERCENT_BPS)) {
      console.log('threshold * bonus(percentage) needs to be less than 100% (10000bps)');
      return;
    }

    // set configuration
    await waitForTx(
      await configurator.setReserveBorrowing(reserveParam.asset, reserveParam.borrowingEnabled)
    );
    console.log('Reserve borrowing set');

    await waitForTx(
      await configurator.configureReserveAsCollateral(
        reserveParam.asset,
        ethers.BigNumber.from(reserveParam.baseLTV),
        ethers.BigNumber.from(reserveParam.liquidationThreshold),
        ethers.BigNumber.from(reserveParam.liquidationBonus)
      )
    );
    console.log('Reserve collateral params set');

    await waitForTx(
      await configurator.setReserveStableRateBorrowing(
        reserveParam.asset,
        reserveParam.stableBorrowingEnabled
      )
    );
    console.log('Reserve stable borrowing set');

    await waitForTx(
      await configurator.setReserveFlashLoaning(reserveParam.asset, reserveParam.flashLoanEnabled)
    );
    console.log('Reserve flashloan set');

    await waitForTx(
      await configurator.setReserveFactor(reserveParam.asset, reserveParam.reserveFactor)
    );
    console.log('Reserve factor set');

    await waitForTx(await configurator.setBorrowCap(reserveParam.asset, reserveParam.borrowCap));
    console.log('Reserve borrow cap set');

    await waitForTx(await configurator.setSupplyCap(reserveParam.asset, reserveParam.supplyCap));
    console.log('Reserve supply cap set');

    console.log('Reserve all configuration set');
  }
);

// npx hardhat --network memecore-testnet memelend:deployRateStrategy
task('memelend:deployRateStrategy', 'Deploy rate strategy').setAction(async ({}, hre) => {
  const ethers = hre.ethers;
  const [signer] = await ethers.getSigners();

  // fill the strategy data
  const strategyData: IInterestRateStrategyParams = {
    name: '',
    optimalUsageRatio: '',
    baseVariableBorrowRate: '',
    variableRateSlope1: '',
    variableRateSlope2: '',
    stableRateSlope1: '',
    stableRateSlope2: '',
    baseStableRateOffset: '',
    stableRateExcessOffset: '',
    optimalStableToTotalDebtRatio: '',
  };

  // deploy rate strategy
  const strategyFactory = new DefaultReserveInterestRateStrategy__factory(signer);
  const strategyInstance = await strategyFactory.deploy(
    POOL_ADDRESS_PROVIDER,
    strategyData.optimalUsageRatio,
    strategyData.baseVariableBorrowRate,
    strategyData.variableRateSlope1,
    strategyData.variableRateSlope2,
    strategyData.stableRateSlope1,
    strategyData.stableRateSlope2,
    strategyData.baseStableRateOffset,
    strategyData.stableRateExcessOffset,
    strategyData.optimalStableToTotalDebtRatio
  );
  await strategyInstance.deployed();

  console.log(`Depoly strategy contract for ${strategyData.name} at ${strategyInstance.address}`);
});

// Param interface for reserve initialization
interface ReserveInitParams {
  aTokenImpl: string;
  stableDebtTokenImpl: string;
  variableDebtTokenImpl: string;
  underlyingAssetDecimals: BigNumberish;
  interestRateStrategyAddress: string;
  underlyingAsset: string;
  treasury: string;
  incentivesController: string;
  underlyingAssetName: string;
  aTokenName: string;
  aTokenSymbol: string;
  variableDebtTokenName: string;
  variableDebtTokenSymbol: string;
  stableDebtTokenName: string;
  stableDebtTokenSymbol: string;
  params: string;
}

// const reservesToDrop = [
//   '0xfda8C165dA5119D2a86d42D6a237f8548d2DC7fa',
//   '0x0fD30BA2Ff7bc336ddaBfb4a4fEE63D0b68b0327',
//   '0xc4463A7456b48500CC2a2B747C54deE0CB671B3c',
//   '0x97189Fa5B08A6F8Ceb2aa4CD4a45429dC0978eb7',
// ];

// npx hardhat --network memecore-testnet memelend:dropReserve --asset 0x97189Fa5B08A6F8Ceb2aa4CD4a45429dC0978eb7
task('memelend:dropReserve', 'Drop reserve')
  .addParam('asset', 'The address of the asset to drop')
  .setAction(async ({ asset }, hre) => {
    const poolAddressProvider = await getPoolAddressesProvider(POOL_ADDRESS_PROVIDER);
    const configuratorAddr = await poolAddressProvider.getPoolConfigurator();
    const configurator = await getPoolConfiguratorProxy(configuratorAddr);

    // use the configurator to drop the reserve
    await waitForTx(await configurator.dropReserve(asset));

    console.log(`Reserve dropped for ${asset}`);
  });
