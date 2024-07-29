import { eContractid, IReserveParams } from '../../helpers/types';

import {
  rateStrategySafeFive,
  rateStrategyNeutralTen,
  rateStrategyRiskyTwenty,
  rateStrategyNoBorrow,
} from './rateStrategies';

export const strategySWTH: IReserveParams = {
  strategy: rateStrategyNoBorrow,
  baseLTVAsCollateral: '3500',
  liquidationThreshold: '4000',
  liquidationBonus: '1500',
  liquidationProtocolFee: '1000', //?
  borrowingEnabled: false,
  stableBorrowRateEnabled: false,
  flashLoanEnabled: false,
  reserveDecimals: '18', //?
  aTokenImpl: eContractid.AToken,
  reserveFactor: '1000', //?
  supplyCap: '2000000000', // 10^9
  borrowCap: '200000', //? 200k
  debtCeiling: '0', //?
  borrowableIsolation: false,
};
