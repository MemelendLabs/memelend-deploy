import { parseUnits } from 'ethers/lib/utils';
import { IInterestRateStrategyParams } from '../../helpers/types';

export const rateStrategySafeFive: IInterestRateStrategyParams = {
  name: 'rateStrategySafeFive',
  optimalUsageRatio: parseUnits('0.80', 27).toString(),
  baseVariableBorrowRate: '0',
  variableRateSlope1: parseUnits('0.05', 27).toString(),
  variableRateSlope2: parseUnits('3', 27).toString(),
  stableRateSlope1: parseUnits('0.2', 27).toString(),
  stableRateSlope2: parseUnits('3', 27).toString(),
  baseStableRateOffset: parseUnits('0.01', 27).toString(),
  stableRateExcessOffset: parseUnits('0.0', 27).toString(),
  optimalStableToTotalDebtRatio: parseUnits('0.2', 27).toString(),
};

export const rateStrategyNeutralTen: IInterestRateStrategyParams = {
  name: 'rateStrategyNeutralTen',
  optimalUsageRatio: parseUnits('0.6', 27).toString(),
  baseVariableBorrowRate: parseUnits('0', 27).toString(),
  variableRateSlope1: parseUnits('0.1', 27).toString(),
  variableRateSlope2: parseUnits('3', 27).toString(),
  stableRateSlope1: parseUnits('0.2', 27).toString(),
  stableRateSlope2: parseUnits('5', 27).toString(),
  baseStableRateOffset: parseUnits('0.01', 27).toString(),
  stableRateExcessOffset: parseUnits('0.0', 27).toString(),
  optimalStableToTotalDebtRatio: parseUnits('0.2', 27).toString(),
};

export const rateStrategyRiskyTwenty: IInterestRateStrategyParams = {
  name: 'rateStrategyRiskyTwenty',
  optimalUsageRatio: parseUnits('0.5', 27).toString(),
  baseVariableBorrowRate: parseUnits('0', 27).toString(),
  variableRateSlope1: parseUnits('0.2', 27).toString(),
  variableRateSlope2: parseUnits('3', 27).toString(),
  stableRateSlope1: parseUnits('0.2', 27).toString(),
  stableRateSlope2: parseUnits('5', 27).toString(),
  baseStableRateOffset: parseUnits('0.01', 27).toString(),
  stableRateExcessOffset: parseUnits('0.0', 27).toString(),
  optimalStableToTotalDebtRatio: parseUnits('0.2', 27).toString(),
};

export const rateStrategyNoBorrow: IInterestRateStrategyParams = {
  name: 'rateStrategyNoBorrow',
  optimalUsageRatio: parseUnits('1', 27).toString(),
  baseVariableBorrowRate: parseUnits('0', 27).toString(),
  variableRateSlope1: parseUnits('0.01', 27).toString(),
  variableRateSlope2: parseUnits('3', 27).toString(),
  stableRateSlope1: parseUnits('0.02', 27).toString(),
  stableRateSlope2: parseUnits('5', 27).toString(),
  baseStableRateOffset: parseUnits('0.01', 27).toString(),
  stableRateExcessOffset: parseUnits('0.0', 27).toString(),
  optimalStableToTotalDebtRatio: parseUnits('0.2', 27).toString(),
};
