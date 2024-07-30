import { task } from 'hardhat/config';
import { getPool, waitForTx } from '../../helpers';

// address of the proxy pool contract
const POOL_ADDRESS = '0x88F4E76115e210c5f12B2b740fADf062E422B27F';

// npx hardhat --network neoX-testnet intersect:supply --asset 0xfd49bEe9a0015743f4f1ce493804b203eca76f29 --behalf '' --referral 0 --amount 1000000;
// npx hardhat --network neoX-testnet intersect:supply --asset 0x646212B2cbdA223eE82C409F50d9EaA790Efa551 --behalf '' --referral 0 --amount 1000000;
task('intersect:supply', 'Supply tokens to the pool')
  .addParam('asset', 'The address of the asset')
  .addParam('amount', 'The amount of asset to supply')
  .addParam('behalf', 'Supplying on behalf which address')
  .addParam('referral', 'Referral code in uint16')
  .setAction(async ({ asset, amount, behalf, referral }, hre) => {
    const poolContract = await getPool(POOL_ADDRESS);

    // approve the supply allowance first
    const ethers = hre.ethers;
    const token = await ethers.getContractAt('TestnetERC20', asset);
    const amountBN = ethers.BigNumber.from(amount);
    await waitForTx(await token.approve(poolContract.address, amountBN));
    console.log('Approved supply allowance');

    if (!behalf) {
      const [signer] = await hre.ethers.getSigners();
      behalf = signer.address;
    }

    const txRes = await waitForTx(await poolContract.supply(asset, amount, behalf, referral));
    console.log(txRes);
  });

// npx hardhat --network neoX-testnet intersect:withdraw --to '' --asset 0xfd49bEe9a0015743f4f1ce493804b203eca76f29 --amount 1000000;
task('intersect:withdraw', 'Withdraw tokens from the pool')
  .addParam('asset', 'The address of the asset')
  .addParam('amount', 'The amount of the asset')
  .addParam('to', 'Withdrawal address')
  .setAction(async ({ asset, amount, to }, hre) => {
    const poolContract = await getPool(POOL_ADDRESS);

    if (!to) {
      const [signer] = await hre.ethers.getSigners();
      to = signer.address;
    }
    const amountBN = hre.ethers.BigNumber.from(amount);

    const txRes = await waitForTx(await poolContract.withdraw(asset, amountBN, to));
    console.log(txRes);
  });

// npx hardhat --network neoX-testnet intersect:borrow --asset 0xfd49bEe9a0015743f4f1ce493804b203eca76f29 --amount 100000 --mode 2 --referral 0 --behalf '';
// npx hardhat --network neoX-testnet intersect:borrow --asset 0x646212B2cbdA223eE82C409F50d9EaA790Efa551 --amount 100000 --mode 2 --referral 0 --behalf '';
task('intersect:borrow', 'Borrow tokens from the pool')
  .addParam('asset', 'The address of the asset')
  .addParam('amount', 'The amount of the asset')
  .addParam('mode', 'Interest rate mode - enum NONE, STABLE, VARIABLE')
  .addParam('referral', 'Referral code in uint16')
  .addParam('behalf', 'Borrowing on behalf which address')
  .setAction(async ({ asset, amount, mode, referral, behalf }, hre) => {
    const poolContract = await getPool(POOL_ADDRESS);

    if (!behalf) {
      const [signer] = await hre.ethers.getSigners();
      behalf = signer.address;
    }

    const amountBN = hre.ethers.BigNumber.from(amount);

    console.log(mode);
    const txRes = await waitForTx(
      await poolContract.borrow(asset, amountBN, mode, referral, behalf)
    );
    console.log(txRes);
  });

// npx hardhat --network neoX-testnet intersect:repay --asset 0xfd49bEe9a0015743f4f1ce493804b203eca76f29 --amount 100000 --mode 2 --behalf '';
task('intersect:repay', 'Repay borrowed tokens to the pool')
  .addParam('asset', 'The address of the asset')
  .addParam('amount', 'The amount of the asset')
  .addParam('mode', 'Interest rate mode - enum NONE, STABLE, VARIABLE')
  .addParam('behalf', 'Repaying on behalf which address')
  .setAction(async ({ asset, amount, mode, behalf }, hre) => {
    const poolContract = await getPool(POOL_ADDRESS);

    if (!behalf) {
      const [signer] = await hre.ethers.getSigners();
      behalf = signer.address;
    }
    const amountBN = hre.ethers.BigNumber.from(amount);

    const token = await hre.ethers.getContractAt('TestnetERC20', asset);
    await waitForTx(await token.approve(poolContract.address, amountBN));
    console.log('Approved supply allowance');

    const txRes = await waitForTx(await poolContract.repay(asset, amountBN, mode, behalf));
    console.log(txRes);
  });

// npx hardhat --show-stack-traces --network neoX-testnet intersect:repayWithATokens --asset 0x646212B2cbdA223eE82C409F50d9EaA790Efa551 --amount 4 --mode 2
// NOTE: you need to have ATokens ie already lending the asset of the debt you want to repay
task('intersect:repayWithATokens', 'Repay borrowed tokens with aTokens to the pool')
  .addParam('asset', 'The address of the asset')
  .addParam('amount', 'The amount of the asset')
  .addParam('mode', 'Interest rate mode - enum NONE, STABLE, VARIABLE')
  .setAction(async ({ asset, amount, mode }, hre) => {
    const poolContract = await getPool(POOL_ADDRESS);

    const amountBN = hre.ethers.BigNumber.from(amount);

    const txRes = await waitForTx(await poolContract.repayWithATokens(asset, amountBN, mode));
    console.log(txRes);
  });

task('intersect:liquidationCall', 'Liquidate a position')
  .addParam('collateral', 'The address of the collateral asset')
  .addParam('debt', 'The address of the debt asset')
  .addParam('user', 'The address of the user')
  .addParam('covering', 'The amount of debt to cover')
  .addParam('receiveAToken', 'Receive aTokens or not')
  .setAction(async ({ collateral, debt, user, covering, receiveAToken }, hre) => {
    const poolContract = await getPool(POOL_ADDRESS);

    const txRes = await waitForTx(
      await poolContract.liquidationCall(collateral, debt, user, covering, receiveAToken)
    );
    console.log(txRes);
  });

// npx hardhat --network neoX-testnet intersect:getUserDetails --user '';
task('intersect:getUserDetails', 'Get user configuration')
  .addParam('user', 'The address of the user')
  .setAction(async ({ user }, hre) => {
    const poolContract = await getPool(POOL_ADDRESS);

    if (!user) {
      const [signer] = await hre.ethers.getSigners();
      user = signer.address;
    }

    const userConfig = await poolContract.getUserAccountData(user);
    console.log('account data', userConfig);
    const userData = await poolContract.getUserConfiguration(user);
    console.log('account config', userData);
  });

// npx hardhat --network neoX-testnet intersect:getReserveFromPool --asset 0x6Ab8ce882d34eE414E09C8C8Fd4715c45592F923;
task('intersect:getReserveFromPool', 'Get reserver data from the pool')
  .addParam('asset', 'The address of the asset')
  .setAction(async ({ asset }, hre) => {
    const poolContract = await getPool(POOL_ADDRESS);

    const reserveData = await poolContract.getReserveData(asset);
    console.log('reserve data', reserveData);
  });
