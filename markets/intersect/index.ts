import { ZERO_ADDRESS } from '../../helpers';
import { IAaveConfiguration, eNeoXNetwork } from '../../helpers/types';

import { CommonsConfig } from './commons';
import {
  strategySWTH,
  strategyWGAS10,
  strategyNEO,
  strategyUSDC,
  strategyUSDT,
  strategyWBTC,
  strategyWETH,
  strategywstETH,
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
    // SWTH: strategySWTH,
    // NEO: strategyNEO,
    WGAS10: strategyWGAS10,
    // USDC: strategyUSDC,
    // USDT: strategyUSDT,
    // WBTC: strategyWBTC,
    // WETH: strategyWETH,
    // WSTETH: strategywstETH,
    // DAI: strategyDAI, // for testing purposes
  },
  ReserveAssets: {
    // Link the actual underlying assets, if not specified mintable asset will be deployed
    [eNeoXNetwork.main]: {
      WGAS10: '0xdE41591ED1f8ED1484aC2CD8ca0876428de60EfF',
    },
    [eNeoXNetwork.testnet]: {
      DAI: '0xfd49bEe9a0015743f4f1ce493804b203eca76f29', // for testing purposes, already deployed on testnet
      LINK: ZERO_ADDRESS,
      USDC: ZERO_ADDRESS,
      WBTC: ZERO_ADDRESS,
      WETH: ZERO_ADDRESS,
      USDT: ZERO_ADDRESS,
      EURS: ZERO_ADDRESS,
    },
  },
};

export default IntersectMarket;
