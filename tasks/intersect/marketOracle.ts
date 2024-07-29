import { task } from 'hardhat/config';
import { getAaveOracle } from '../../helpers';

// npx hardhat --network neoX-testnet intersect:addAssetSource --oracle 0xE080C52Ac53173A5615bCDd6AB1cD6d85B1500C7 --asset 0x646212B2cbdA223eE82C409F50d9EaA790Efa551 --source 0x3E0c6a7bE84F5B9CA740f3E2CeaC03f451Bb80cf;
task('intersect:addAssetSource', 'Add asset source to the market')
  .addParam('oracle', 'The address of AaveOracle')
  .addParam('asset', 'The address of asset')
  .addParam('source', 'The address of source CLA')
  .setAction(async ({ oracle, asset, source }, hre) => {
    const marketOracle = await getAaveOracle(oracle);

    // const marketContract = await ethers.getContractAt('Market', asset, signer);
    // const res = await marketContract.addAssetSource(source);
    const res = await marketOracle.setAssetSources([asset], [source]);

    console.log(res);

    console.log(`Added ${source} as asset source to ${asset}`);
  });

// npx hardhat --network neoX-testnet intersect:getAssetPrice --oracle 0x86d958A24452af1aFFFd58dA461ea52b71ba410c --asset 0xfd49bEe9a0015743f4f1ce493804b203eca76f29
task('intersect:getAssetPrice', 'Get asset price from the market oracle')
  .addParam('oracle', 'The address of market oracle')
  .addParam('asset', 'The address of asset')
  .setAction(async ({ oracle, asset }, hre) => {
    const marketOracle = await getAaveOracle(oracle);

    const price = await marketOracle.getAssetPrice(asset);

    console.log(`Price of ${asset} is ${price}`);
  });
