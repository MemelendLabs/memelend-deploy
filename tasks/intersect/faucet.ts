import { task } from 'hardhat/config';
import { getFaucet } from '../../helpers';

task('checkFaucet', 'Query the faucet params')
  .addParam('faucet', 'The address of faucet')
  .setAction(async ({ faucet }, hre) => {
    const ethers = hre.ethers;

    const [signer] = await ethers.getSigners();

    const faucetContract = await ethers.getContractAt('Faucet', faucet, signer);

    const owner = await faucetContract.owner();
    console.log('Owner of faucet is :', owner);
  });

// npx hardhat --network neoX-testnet intersect:mintToken --faucet 0x6bEff72Fe5262eDe32aEC2323DD086A5C3E62B18 --token 0x0fD30BA2Ff7bc336ddaBfb4a4fEE63D0b68b0327 --to '' --amount 200000000000000000000
task('intersect:mintToken', 'Mint asset through faucet')
  .addParam('faucet', 'The address of faucet')
  .addParam('token', 'The address of token')
  .addParam('to', 'To address')
  .addParam('amount', 'amnount of token to mint')
  .setAction(async ({ faucet, token, to, amount }, hre) => {
    const ethers = hre.ethers;
    const [signer] = await ethers.getSigners();

    if (!to) {
      to = signer.address;
    }

    const amountBN = ethers.BigNumber.from(amount);

    const faucetContract = await getFaucet(faucet);
    const res = await faucetContract.mint(token, to, amountBN);
    console.log(res);

    console.log(`Minted ${amount} of ${token} to ${to}`);
  });
