import { eMemeCoreNetwork } from '../../helpers/types';
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
  MarketId: 'Commons Memelend Market',
  ATokenNamePrefix: 'Memelend',
  StableDebtTokenNamePrefix: 'Memelend',
  VariableDebtTokenNamePrefix: 'Memelend',
  SymbolPrefix: 'MLEND',
  ProviderId: 8080,
  OracleQuoteCurrencyAddress: ZERO_ADDRESS,
  OracleQuoteCurrency: 'USD',
  OracleQuoteUnit: '18',
  WrappedNativeTokenSymbol: 'WM',
  ChainlinkAggregator: {
    // TODO: Add Chainlink Aggregator addresses
    [eMemeCoreNetwork.main]: {
      WM: '0xde41591ed1f8ed1484ac2cd8ca0876428de60eff',
    },
    [eMemeCoreNetwork.testnet]: {
      WM: '0x477949114F685B2290026652C03753dd9Ef00B4f',
      TEST: '0xB28F39BDba7feD13c7e5FB050881bfA6b49eBf3b',
      WBTC: '0x1A54a99BEC922b5Da9C254AAa1E450121D77fA44',
      USDC: '0xdc1528FF2Da97152aa6C41B86704BF18f8cA0a09',
    },
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
    [eMemeCoreNetwork.testnet]: true,
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
