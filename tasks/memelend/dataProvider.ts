import { task } from 'hardhat/config';
import { getAaveProtocolDataProvider } from '../../helpers';

// npx hardhat --network memecore-testnet memelend:getAllPoolTokenData --provider 0x13Dda77aa1cC0992D10Ba875C55f69909b8EA64f
task('memelend:getAllPoolTokenData', 'Get all tokens for the pool')
  .addParam('provider', 'The address of the poolDataProvider')
  .setAction(async ({ provider }, hre) => {
    const dataProvider = await getAaveProtocolDataProvider(provider);
    const tokens = dataProvider.getAllATokens();
    const reserves = dataProvider.getAllReservesTokens();

    const [tokenRes, reservesRes] = await Promise.all([tokens, reserves]);
    console.log('ATokens:', tokenRes);
    console.log('Reserves:', reservesRes);
  });

// npx hardhat --network memecore-testnet memelend:getReserveData --provider 0x13Dda77aa1cC0992D10Ba875C55f69909b8EA64f --asset 0x1CE16390FD09040486221e912B87551E4e44Ab17;
task('memelend:getReserveData', 'Get reserve parameters for the asset')
  .addParam('provider', 'The address of the poolDataProvider')
  .addParam('asset', 'The address of the asset')
  .setAction(async ({ provider, asset }, hre) => {
    const dataProvider = await getAaveProtocolDataProvider(provider);
    const reserveData = await dataProvider.getReserveData(asset);

    console.log(reserveData);
  });

// npx hardhat --network memecore-testnet memelend:getReserveConfig --provider 0x13Dda77aa1cC0992D10Ba875C55f69909b8EA64f --asset 0x1CE16390FD09040486221e912B87551E4e44Ab17;
task('memelend:getReserveConfig', 'Get reserve configuration for the asset')
  .addParam('provider', 'The address of the poolDataProvider')
  .addParam('asset', 'The address of the asset')
  .setAction(async ({ provider, asset }, hre) => {
    const dataProvider = await getAaveProtocolDataProvider(provider);
    const reserveConfig = await dataProvider.getReserveConfigurationData(asset);

    const assetCap = await dataProvider.getReserveCaps(asset);
    console.log('Asset cap:', assetCap);

    console.log(reserveConfig);
  });

// npx hardhat --network memecore-testnet memelend:totalAssetDebt --provider 0x2bB8545CC96783A7929840640312F598015cC45A --asset 0xfd49bEe9a0015743f4f1ce493804b203eca76f29;
task('memelend:totalAssetDebt', 'Get total debt of the asset')
  .addParam('provider', 'The address of the poolDataProvider')
  .addParam('asset', 'The address of the asset')
  .setAction(async ({ provider, asset }, hre) => {
    const dataProvider = await getAaveProtocolDataProvider(provider);
    const reserveConfig = await dataProvider.getTotalDebt(asset);

    console.log(reserveConfig);
  });

//  npx hardhat --network memecore-testnet memelend:getUserReserveData --provider 0x13Dda77aa1cC0992D10Ba875C55f69909b8EA64f --asset 0x0fD30BA2Ff7bc336ddaBfb4a4fEE63D0b68b0327 --user '0x05e8EFDe59606B1aB4E1EefB992E99939117aD62'
task('memelend:getUserReserveData', 'Get user data for a given reserve')
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

//  npx hardhat --network memecore-testnet memelend:getReserveTokenAddresses --provider 0x13Dda77aa1cC0992D10Ba875C55f69909b8EA64f --asset 0x1CE16390FD09040486221e912B87551E4e44Ab17
task('memelend:getReserveTokenAddresses', 'Gets the token addresses for a reserve')
  .addParam('provider', 'The address of the poolDataProvider')
  .addParam('asset', 'The address of the asset')
  .setAction(async ({ provider, asset }, hre) => {
    const dataProvider = await getAaveProtocolDataProvider(provider);

    const tokenAddresses = await dataProvider.getReserveTokensAddresses(asset);

    console.log(tokenAddresses);
  });
