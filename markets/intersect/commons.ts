import { eNeoXNetwork } from './../../helpers/types';
import { ZERO_ADDRESS } from '../../helpers/constants';
import { ICommonConfiguration } from '../../helpers/types';
import {
  rateStrategySafeFive,
  rateStrategyNeutralTen,
  rateStrategyRiskyTwenty,
  rateStrategyNoBorrow,
} from './rateStrategies';
// ----------------
// PROTOCOL GLOBAL PARAMS
// ----------------

export const CommonsConfig: ICommonConfiguration = {
  MarketId: 'Commons Intersect Market',
  ATokenNamePrefix: 'Intersect',
  StableDebtTokenNamePrefix: 'Intersect',
  VariableDebtTokenNamePrefix: 'Intersect',
  SymbolPrefix: 'In',
  ProviderId: 8080,
  OracleQuoteCurrencyAddress: ZERO_ADDRESS,
  OracleQuoteCurrency: 'USDT',
  OracleQuoteUnit: '8',
  WrappedNativeTokenSymbol: 'WGAS10',
  ChainlinkAggregator: {
    // TODO: Add Chainlink Aggregator addresses
    [eNeoXNetwork.main]: {
      WGAS10: '0xde41591ed1f8ed1484ac2cd8ca0876428de60eff',
    },
    [eNeoXNetwork.testnet]: {},
  },
  ReserveFactorTreasuryAddress: {},
  FallbackOracle: {},
  ReservesConfig: {},
  IncentivesConfig: { enabled: {}, rewards: {}, rewardsOracle: {}, incentivesInput: {} },
  EModes: {
    // StableEMode: {
    //   id: '1',
    //   ltv: '9300',
    //   liquidationThreshold: '9500',
    //   liquidationBonus: '10100',
    //   label: 'Stablecoin',
    //   assets: ['USDC', 'USDT'],
    // },
    // ETH: {
    //   id: '2',
    //   ltv: '9300',
    //   liquidationThreshold: '9500',
    //   liquidationBonus: '10300',
    //   label: 'Stablecoin',
    //   assets: ['WETH', 'WSTETH'],
    // },
  },
  L2PoolEnabled: {
    [eNeoXNetwork.testnet]: true,
  },
  ParaswapRegistry: {},
  FlashLoanPremiums: {
    total: 0.0005e4,
    protocol: 0.0004e4,
  },
  RateStrategies: {
    rateStrategySafeFive,
    rateStrategyNeutralTen,
    rateStrategyRiskyTwenty,
    rateStrategyNoBorrow,
  },
};
