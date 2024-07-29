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

// npx hardhat --network neoX-testnet intersect:mintToken --faucet 0x86d958A24452af1aFFFd58dA461ea52b71ba410c --token 0xfd49bEe9a0015743f4f1ce493804b203eca76f29 --to '' --amount 200000000000000000000
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

    const amountBN = ethers.BigNumber.from(amount).mul(ethers.BigNumber.from(10).pow(18));

    const faucetContract = await getFaucet(faucet);
    const res = await faucetContract.mint(token, to, amountBN);
    console.log(res);

    console.log(`Minted ${amount} of ${token} to ${to}`);
  });
