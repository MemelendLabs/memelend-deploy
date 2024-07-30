import { ZERO_ADDRESS } from '../../helpers';
import { IAaveConfiguration, eNeoXNetwork } from '../../helpers/types';

import { CommonsConfig } from './commons';
import {
  strategySWTH,
  strategyGAS,
  strategyNEO,
  strategyUSDC,
  strategyUSDT,
  strategyWBTC,
  strategyWETH,
  strategyWSTETH,
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
    GAS: strategyGAS,
    USDC: strategyUSDC,
    USDT: strategyUSDT,
    WBTC: strategyWBTC,
    WETH: strategyWETH,
    WSTETH: strategyWSTETH,
  },
  ReserveAssets: {
    // Link the actual underlying assets, if not specified mintable asset will be deployed
    [eNeoXNetwork.testnet]: {
      // AAVE: ZERO_ADDRESS,
      // DAI: ZERO_ADDRESS,
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
