import axios from 'axios';
import Web3 from 'web3';
// import config from 'config';
// import { CONSTANTS } from '../../config/constants';
import { CONSTANTS } from '../constants/constants';
import { AbiItem } from 'web3-utils';
import { ethers } from 'ethers';
import { NftType } from '../Views/Transfer';
// import { NftType } from '../Views/Home/nftCard';


export async function fetchEvmNfts(account: string): Promise<any[]>{
    const api = `https://testnets-api.opensea.io/api/v1/assets?owner=${account}`;
    const response = await axios.get(api);
    if(response.status === 200){
        return response.data.assets;
    }else{
        return []
    }
}

export async function approveNft(contractAddress: string, nftId: number | string, account: string) {
    // const provider = config.get<string>("EVM_PROVIDER");
    const { ethereum } = window;
    if(!ethereum){
        alert("Wallet not found!");
        return;
    }
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    // const provider = CONSTANTS.EVM_PROVIDER;
    // const receiverAddress = config.get<string>("NFT_RECEIVER");
    const receiverAddress = CONSTANTS.NFT_RECEIVER;
    console.log("approving to: ",receiverAddress);
    // const abi = config.get<AbiItem>("ABI");
    const abiJson = <any>CONSTANTS.ABI;
    const abi = <any>abiJson;
    console.log('given provider = ', Web3.givenProvider);
    const web3 = new Web3(Web3.givenProvider);
    // const contract = new web3.eth.Contract(abi, contractAddress);
    const contract = new ethers.Contract(contractAddress, abi, signer);
    console.log("Contract = ",contract);
    // const result = await contract.methods.approve(receiverAddress, nftId).send({from: account});
    const approveTxn = await contract.approve(receiverAddress, nftId);
    await approveTxn.wait();
    console.log('transaction status : ',approveTxn);
}

export async function getCustomTokenDetails(contractAddress: string, nftId: string | number): Promise<NftType | null> {
    const { ethereum } = window;
    if(!ethereum) {
        alert("wallet not found!");
        return null;
    }
    const abi = <any>CONSTANTS.ABI;
    // const provider = new ethers.providers.Web3Provider(ethereum);
    const provider = CONSTANTS.EVM_PROVIDER;
    // const contract = new ethers.Contract(contractAddress, abi);
    const web3 = new Web3(provider);
    const contract = new web3.eth.Contract(abi, contractAddress);
    const owner = await contract.methods.ownerOf(nftId).call();
    const tokenUri = await contract.methods.tokenURI(nftId).call();
    const result = await axios.get(tokenUri);
    const metadata = result.data;
    const nft: NftType = {
        metadata: tokenUri,
        owner,
        tokenId: nftId,
        contractAddress,
        image: metadata.image
    };
    console.log('this is the nft: ',nft);
    return nft;
}
