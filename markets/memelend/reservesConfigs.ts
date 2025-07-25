import { eContractid, IReserveParams } from '../../helpers/types';

import {
  rateStrategySafeFive,
  rateStrategyNeutralTen,
  rateStrategyRiskyTwenty,
  rateStrategyNoBorrow,
} from './rateStrategies';

export const strategyWM: IReserveParams = {
  strategy: rateStrategyNeutralTen,
  baseLTVAsCollateral: '5000',
  liquidationThreshold: '6000',
  liquidationBonus: '10300',
  liquidationProtocolFee: '1000',
  borrowingEnabled: true,
  stableBorrowRateEnabled: false,
  flashLoanEnabled: true,
  reserveDecimals: '8',
  aTokenImpl: eContractid.AToken,
  reserveFactor: '1000',
  supplyCap: '100000',
  borrowCap: '100000',
  debtCeiling: '0',
  borrowableIsolation: false,
};

export const strategyWBTC: IReserveParams = {
  strategy: rateStrategySafeFive,
  baseLTVAsCollateral: '8000',
  liquidationThreshold: '8300',
  liquidationBonus: '10700',
  liquidationProtocolFee: '1000',
  borrowingEnabled: true,
  stableBorrowRateEnabled: false,
  flashLoanEnabled: true,
  reserveDecimals: '8',
  aTokenImpl: eContractid.AToken,
  reserveFactor: '1000',
  supplyCap: '1000',
  borrowCap: '1000',
  debtCeiling: '0',
  borrowableIsolation: false,
};

export const strategyWETH: IReserveParams = {
  strategy: rateStrategySafeFive,
  baseLTVAsCollateral: '8000',
  liquidationThreshold: '8300',
  liquidationBonus: '10700',
  liquidationProtocolFee: '1000',
  borrowingEnabled: true,
  stableBorrowRateEnabled: false,
  flashLoanEnabled: true,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  reserveFactor: '1000',
  supplyCap: '1000',
  borrowCap: '1000',
  debtCeiling: '0',
  borrowableIsolation: false,
};

export const strategyUSDC: IReserveParams = {
  strategy: rateStrategySafeFive,
  baseLTVAsCollateral: '8500',
  liquidationThreshold: '8800',
  liquidationBonus: '10500',
  liquidationProtocolFee: '1000',
  borrowingEnabled: true,
  stableBorrowRateEnabled: false,
  flashLoanEnabled: true,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  reserveFactor: '1000',
  supplyCap: '10000000',
  borrowCap: '10000000',
  debtCeiling: '0',
  borrowableIsolation: false,
};

export const strategyUSDT: IReserveParams = {
  strategy: rateStrategySafeFive,
  baseLTVAsCollateral: '8500',
  liquidationThreshold: '8800',
  liquidationBonus: '10500',
  liquidationProtocolFee: '1000',
  borrowingEnabled: true,
  stableBorrowRateEnabled: false,
  flashLoanEnabled: true,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  reserveFactor: '1000',
  supplyCap: '10000000',
  borrowCap: '10000000',
  debtCeiling: '0',
  borrowableIsolation: false,
};

export const strategywstETH: IReserveParams = {
  strategy: rateStrategySafeFive,
  baseLTVAsCollateral: '7500',
  liquidationThreshold: '7900',
  liquidationBonus: '10700',
  liquidationProtocolFee: '1000',
  borrowingEnabled: true,
  stableBorrowRateEnabled: false,
  flashLoanEnabled: true,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  reserveFactor: '1000',
  supplyCap: '1000',
  borrowCap: '1000',
  debtCeiling: '0',
  borrowableIsolation: false,
};

// For testing purposes
export const strategyDAI: IReserveParams = {
  strategy: rateStrategyRiskyTwenty,
  baseLTVAsCollateral: '7500',
  liquidationThreshold: '8000',
  liquidationBonus: '10500',
  liquidationProtocolFee: '1000',
  borrowingEnabled: true,
  stableBorrowRateEnabled: true,
  flashLoanEnabled: true,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  reserveFactor: '1000',
  supplyCap: '2000000000',
  borrowCap: '0',
  debtCeiling: '0',
  borrowableIsolation: true,
};
