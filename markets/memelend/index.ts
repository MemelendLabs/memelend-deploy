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
    USDC: strategyUSDC,
    // USDT: strategyUSDT,
    WBTC: strategyWBTC,
    // WETH: strategyWETH,
    // WSTETH: strategywstETH,
    TEST: strategyDAI, // for testing purposes
  },
  ReserveAssets: {
    // Link the actual underlying assets, if not specified mintable asset will be deployed
    [eMemeCoreNetwork.main]: {
      WM: '0x653e645e3d81a72e71328Bc01A04002945E3ef7A',
    },
    [eMemeCoreNetwork.testnet]: {
      TEST: '0x6165353FC873328316d5299b86E855B74FD83389', // for testing purposes, already deployed on testnet
      WM: '0x8c267Ca5A02Ce70F61f64f9d9Dcc31D4F4f1C825', // for testing purposes, already deployed on testnet
      LINK: ZERO_ADDRESS,
      USDC: '0xe515EEfc428432B749b48F61D434ef905ba67564',
      WBTC: '0xF6E3DDe8D97632D20F73fB8E80b65072F2876b34',
      WETH: ZERO_ADDRESS,
      USDT: ZERO_ADDRESS,
      EURS: ZERO_ADDRESS,
    },
  },
};

export default MemelendMarket;
