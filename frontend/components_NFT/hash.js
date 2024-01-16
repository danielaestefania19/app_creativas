const ethers = require('ethers');

async function getTransactionDetails() {
    const provider = new ethers.providers.JsonRpcProvider('https://testnet.bitfinity.network');
    const transactionHash = '0xc04cb0570f634b2fb02ddf678eb57200281d4665379d8e0e391f47468a42e3a2';
    const transactionReceipt = await provider.getTransactionReceipt(transactionHash);

    console.log(transactionReceipt);
}

getTransactionDetails();
