import { task } from 'hardhat/config';
import { getAaveProtocolDataProvider } from '../../helpers';

// npx hardhat --network neoX-testnet intersect:getAllPoolTokenData --provider 0x2bB8545CC96783A7929840640312F598015cC45A;npx hardhat --network neoX-testnet intersect:getPoolTokenData --provider 0x2bB8545CC96783A7929840640312F598015cC45A
task('intersect:getAllPoolTokenData', 'Get all tokens for the pool')
  .addParam('provider', 'The address of the poolDataProvider')
  .setAction(async ({ provider }, hre) => {
    const dataProvider = await getAaveProtocolDataProvider(provider);
    const tokens = dataProvider.getAllATokens();
    const reserves = dataProvider.getAllReservesTokens();

    const [tokenRes, reservesRes] = await Promise.all([tokens, reserves]);
    console.log('ATokens:', tokenRes);
    console.log('Reserves:', reservesRes);
  });

// npx hardhat --network neoX-testnet intersect:getReserveData --provider 0x2bB8545CC96783A7929840640312F598015cC45A --asset 0xfd49bEe9a0015743f4f1ce493804b203eca76f29;
task('intersect:getReserveData', 'Get reserve parameters for the asset')
  .addParam('provider', 'The address of the poolDataProvider')
  .addParam('asset', 'The address of the asset')
  .setAction(async ({ provider, asset }, hre) => {
    const dataProvider = await getAaveProtocolDataProvider(provider);
    const reserveData = await dataProvider.getReserveData(asset);

    console.log(reserveData);
  });

// npx hardhat --network neoX-testnet intersect:getReserveConfig --provider 0x2bB8545CC96783A7929840640312F598015cC45A --asset 0xfd49bEe9a0015743f4f1ce493804b203eca76f29;
task('intersect:getReserveConfig', 'Get reserve configuration for the asset')
  .addParam('provider', 'The address of the poolDataProvider')
  .addParam('asset', 'The address of the asset')
  .setAction(async ({ provider, asset }, hre) => {
    const dataProvider = await getAaveProtocolDataProvider(provider);
    const reserveConfig = await dataProvider.getReserveConfigurationData(asset);

    console.log(reserveConfig);
  });

// npx hardhat --network neoX-testnet intersect:totalAssetDebt --provider 0x2bB8545CC96783A7929840640312F598015cC45A --asset 0xfd49bEe9a0015743f4f1ce493804b203eca76f29;
task('intersect:totalAssetDebt', 'Get total debt of the asset')
  .addParam('provider', 'The address of the poolDataProvider')
  .addParam('asset', 'The address of the asset')
  .setAction(async ({ provider, asset }, hre) => {
    const dataProvider = await getAaveProtocolDataProvider(provider);
    const reserveConfig = await dataProvider.getTotalDebt(asset);

    console.log(reserveConfig);
  });

//  npx hardhat --network neoX-testnet intersect:getUserReserveData --provider 0x2bB8545CC96783A7929840640312F598015cC45A --asset 0xfd49bEe9a0015743f4f1ce493804b203eca76f29 --user ''
task('intersect:getUserReserveData', 'Get user data for a given reserve')
  .addParam('provider', 'The address of the poolDataProvider')
  .addParam('asset', 'The address of the asset')
  .addParam('user', 'The address of the user')
  .setAction(async ({ provider, asset, user }, hre) => {
    const dataProvider = await getAaveProtocolDataProvider(provider);

    if (!user) {
      const [signer] = await hre.ethers.getSigners();
      user = signer.address;
    }

    const userData = await dataProvider.getUserReserveData(asset, user);

    console.log(userData);
  });
