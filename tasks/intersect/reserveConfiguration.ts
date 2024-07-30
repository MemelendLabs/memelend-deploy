import { task } from 'hardhat/config';

import { BigNumberish } from 'ethers';
import {
  waitForTx,
  getPool,
  eContractid,
  getPoolAddressesProvider,
  getPoolConfiguratorProxy,
  IInterestRateStrategyParams,
  IReserveParams,
} from '../../helpers';
import { DefaultReserveInterestRateStrategy__factory, MintableERC20__factory } from '../../helpers';

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

const POOL_ADDRESS_PROVIDER = '0xad4FCd209503137a237119d8f6e946CA61324051';
const ASSET_ADDRESS = '0x6Ab8ce882d34eE414E09C8C8Fd4715c45592F923';

const HUNDRED_PERCENT_BPS = '10000';

// npx hardhat --network neoX-testnet intersect:setReserveConfiguration
task('intersect:setReserveConfiguration', 'Set reserve configuration for the asset').setAction(
  async ({}, hre) => {
    const ethers = hre.ethers;

    const poolAddressProvider = await getPoolAddressesProvider(POOL_ADDRESS_PROVIDER);
    const configuratorAddr = await poolAddressProvider.getPoolConfigurator();
    const configurator = await getPoolConfiguratorProxy(configuratorAddr);

    const reserveParam: InputParams = {
      asset: ASSET_ADDRESS,
      baseLTV: '8000',
      liquidationThreshold: '8500',
      liquidationBonus: '10500',
      reserveFactor: '1000',
      borrowCap: '1000000000',
      supplyCap: '2000000000',
      borrowingEnabled: true,
      stableBorrowingEnabled: false,
      flashLoanEnabled: false,
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

// npx hardhat --network neoX-testnet intersect:deployRateStrategy
task('itersect:deployRateStrategy', 'Deploy rate strategy').setAction(async ({}, hre) => {
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

// Param interface for reserver initialization
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

const A_TOKEN_IMPL = '0x8169459BfF8cf433A16c0D4a16075d4e9be25458';
const VARIABLE_TOKEN_IMPL = '0xE186284823Ee249846112a1CB4742cD8cA1B6cB4';
const STABLE_TOKEN_IMPL = '0x3a571dCb2449D01870C88c916C36b1B5D467774c';
const STRATEGY_ADDRESS = '0xC0D22793Be4603eD79e2800523627e42b0F102C2';
const UNDERLYING_ADDRESS = '';
const UNDERLYING_NAME = 'AAVE2';
const UNDERLYING_DECIMALS = '18';
const TREASURY_ADDRESS = '0x68285085285fdf2C6B43B5135b7bEBC08F82F570';
const INCENTIVES_ADDRESS = '0xef98BBcAd94C21DdeD8FCd8d4B2c103B5251666c';

const TOKEN_NAME = 'aInSwth';
const TOKEN_SYMBOL = 'aInSWTH';
const VAR_TOKEN_NAME = 'variableDebInSwth';
const VAR_TOKEN_SYMBOL = 'variableDebInSWTH';
const STABLE_TOKEN_NAME = 'stableDebtInSwth';
const STABLE_TOKEN_SYMBOL = 'stableDebtInSWTH';

// npx hardhat --network neoX-testnet intersect:initReserve
task('intersect:initReserve', 'Initialize reserve').setAction(async ({}, hre) => {
  const poolAddressProvider = await getPoolAddressesProvider(POOL_ADDRESS_PROVIDER);
  const configuratorAddr = await poolAddressProvider.getPoolConfigurator();
  const configurator = await getPoolConfiguratorProxy(configuratorAddr);

  // if the underlying is not specified it needs to be deployed
  // ! this needs to be changed for mainnet
  let underlyingAsset = UNDERLYING_ADDRESS;
  if (underlyingAsset == '') {
    console.log('deploying underlying asset');
    const ethers = hre.ethers;
    const [signer] = await ethers.getSigners();
    const tokenFactory = new MintableERC20__factory(signer);
    const tokenInstance = await tokenFactory.deploy(
      UNDERLYING_NAME,
      UNDERLYING_NAME,
      UNDERLYING_DECIMALS
    );
    await tokenInstance.deployed();
    underlyingAsset = tokenInstance.address;
    console.log(`deployed underlying asset at ${underlyingAsset}`);
  }

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
  console.log('Please run the reserve configuration task to set the reserve configuration');
});
