import { ZERO_ADDRESS } from '../../helpers';
import { IAaveConfiguration, eNeoXNetwork } from '../../helpers/types';

import { CommonsConfig } from './commons';
import {
  strategySWTH,
  strategyWGAS,
  strategyNEO,
  strategyUSDC,
  strategyUSDT,
  strategyWBTC,
  strategyWETH,
  strategyWSTETH,
  strategyDAI,
} from './reservesConfigs';

// ----------------
// POOL--SPECIFIC PARAMS
// ----------------

export const IntersectMarket: IAaveConfiguration = {
  ...CommonsConfig,
  MarketId: 'Intersect Market',
  ATokenNamePrefix: 'Intersect',
  StableDebtTokenNamePrefix: 'Intersect',
  VariableDebtTokenNamePrefix: 'Intersect',
  SymbolPrefix: 'In',
  ProviderId: 30,
  ReservesConfig: {
    // Add the reserve strategy
    SWTH: strategySWTH,
    NEO: strategyNEO,
    WGAS: strategyWGAS,
    USDC: strategyUSDC,
    USDT: strategyUSDT,
    WBTC: strategyWBTC,
    WETH: strategyWETH,
    WSTETH: strategyWSTETH,
    DIA: strategyDAI, // for testing purposes
  },
  ReserveAssets: {
    // Link the actual underlying assets, if not specified mintable asset will be deployed
    [eNeoXNetwork.testnet]: {
      DAI: '0xfd49bEe9a0015743f4f1ce493804b203eca76f29', // for testing purposes, already deployed on testnet
      // LINK: ZERO_ADDRESS,
      // USDC: ZERO_ADDRESS,
      // WBTC: ZERO_ADDRESS,
      // WETH: ZERO_ADDRESS,
      // USDT: ZERO_ADDRESS,
      // EURS: ZERO_ADDRESS,
    },
  },
};

export default IntersectMarket;
