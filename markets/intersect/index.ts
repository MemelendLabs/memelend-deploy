import { ZERO_ADDRESS } from '../../helpers';
import { IAaveConfiguration, eEthereumNetwork } from '../../helpers/types';

import { CommonsConfig } from './commons';
import { strategySWTH } from './reservesConfigs';

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
    SWTH: strategySWTH,
  },
  ReserveAssets: {
    [eEthereumNetwork.rinkeby]: {
      AAVE: ZERO_ADDRESS,
      DAI: ZERO_ADDRESS,
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
