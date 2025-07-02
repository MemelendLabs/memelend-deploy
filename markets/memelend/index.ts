import { ZERO_ADDRESS } from '../../helpers';
import { IAaveConfiguration, eMemeCoreNetwork } from '../../helpers/types';

import { CommonsConfig } from './commons';
import {
  strategyUSDC,
  strategyUSDT,
  strategyWBTC,
  strategyWETH,
  strategywstETH,
  strategyDAI,
  strategyWM,
} from './reservesConfigs';

// ----------------
// POOL--SPECIFIC PARAMS
// ----------------

// TODO: DKLOG: Change the market configurations
export const MemelendMarket: IAaveConfiguration = {
  ...CommonsConfig,
  MarketId: 'Memelend Market',
  ATokenNamePrefix: 'Memelend',
  StableDebtTokenNamePrefix: 'Memelend',
  VariableDebtTokenNamePrefix: 'Memelend',
  SymbolPrefix: 'MLEND',
  ProviderId: 30,
  ReservesConfig: {
    WM: strategyWM,
    // USDC: strategyUSDC,
    // USDT: strategyUSDT,
    // WBTC: strategyWBTC,
    // WETH: strategyWETH,
    // WSTETH: strategywstETH,
    // DAI: strategyDAI, // for testing purposes
  },
  ReserveAssets: {
    // Link the actual underlying assets, if not specified mintable asset will be deployed
    [eMemeCoreNetwork.main]: {
      WM: '0x653e645e3d81a72e71328Bc01A04002945E3ef7A',
    },
    [eMemeCoreNetwork.testnet]: {
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

export default MemelendMarket;
