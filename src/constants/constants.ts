// import { abi } from './approveAbi.json';
//
import abi from './approveAbi.json';

// const abiJson = {
//   "abi": [
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "to",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "tokenId",
//           "type": "uint256"
//         }
//       ],
//       "name": "approve",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     }
//   ]
// }



export const CONSTANTS = {
    EVM_PROVIDER: 'https://polygon-mumbai.g.alchemy.com/v2/5gvxdiPQMpVWvyYQ1CBjz7vllUuYAXtm',
    POLKADOT_PROVIDER: 'wss://social_li_n1.wowlabz.com/',
    ABI: abi.abi,
    POLKADOT_ADDRESS: '5ELXsKZCm71TXXUz9C9CixyvS9HmnMMcdWBPuoYJU47ohVai',
    NFT_RECEIVER: '0x2A2bd5C235fdFC7081a55c9064A9545527DBf887',
    ETHTOPOLKAURI: 'https://backendnftbridge.metaport.to/ethereum-to-polkadot',
    POLKATOETHURI: 'https://backendnftbridge.metaport.to/polkadot-to-ethereum',
}
