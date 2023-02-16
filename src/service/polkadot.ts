// import config from 'config';
import { WsProvider, ApiPromise } from '@polkadot/api';
import { ApiTypes, SubmittableExtrinsic } from '@polkadot/api-base/types';
import { web3FromAddress } from '@polkadot/extension-dapp';
import axios from 'axios';
import { CONSTANTS } from '../constants/constants';

interface Owner{
    AccountId: string
}
interface PolkadotNft{
    owner: Owner,
    nftName: string,
    description: string,
    metadata: string,
    collectionId: string,
    nftId: string,
    image: string
}

export async function transferUserNftToSelf(collectionId: string|number, nftId: string|number, accountId: string) {
    // const substrateProvider = config.get<string>("POLKADOT_PROVIDER");
    const substrateProvider = CONSTANTS.POLKADOT_PROVIDER;
    const wsProvider = new WsProvider(substrateProvider);
    const api = new ApiPromise({provider: wsProvider});
    await api.isReady;
    // const newOwner = config.get<string>("POLKADOT_ADDRESS");
    const newOwner = CONSTANTS.POLKADOT_ADDRESS;
    const receiver = {
        AccountId: newOwner
    };
    const transaction = api.tx.metahomeNft.send(collectionId, nftId, receiver);
    await handleTransaction(transaction, accountId);
}

export async function fetchUserNfts(accountId: string): Promise<PolkadotNft[]> {
    // const substrateProvider = config.get<string>("POLKADOT_PROVIDER");
    const substrateProvider = CONSTANTS.POLKADOT_PROVIDER;
    const wsProvider = new WsProvider(substrateProvider);
    const api = new ApiPromise({provider: wsProvider});
    await api.isReady;
    const latestCollectionIndex = await getLatestCollectionIndex(api);
    const nftList: PolkadotNft[] = [];
    if(!latestCollectionIndex) return nftList;
    for(let i=0; i<= latestCollectionIndex; i++){
        const latestNftIndex = await getLatestNftIndex(api, i);
        if(latestNftIndex){
            for(let j=0; j<=latestNftIndex; j++){
                const nft = await getNftDetails(api, i, j);
                // console.log('got nft = ', nft);
                if(nft){
                    if(nft.owner.AccountId === accountId){
                        nft.collectionId = i.toString();
                        nft.nftId = j.toString();
                        nftList.push(nft);
                    }
                }
            }
        }
    }
    return nftList;
}

async function getLatestCollectionIndex(api: ApiPromise) {
    if (api === null) return;
    const collectionIndex = await api.query.metahomeNft.collectionIndex();
    return collectionIndex.toHuman();
}

async function getLatestNftIndex (api: ApiPromise, collectionIndex: string|number){
  if (api === null) return;

  const nftIndex = await api.query.metahomeNft.nextNftId(collectionIndex);
    return nftIndex.toHuman();
};

async function getNftDetails(api: ApiPromise, collectionId: string|number, nftId: string|number): Promise<PolkadotNft|null>{
    if (api === null) return null;

    const nftHex = await api.query.metahomeNft.nfts(collectionId, nftId);
    const nftHuman = <any>nftHex.toHuman();
    if(!nftHuman){
        return null;
    }
    const metadataUri = nftHuman.metadata;
    const res = await axios.get(metadataUri);
    if(typeof res.data === typeof "") return null;

    const metadata = res.data;
    const nft = <PolkadotNft>nftHuman;
    nft.nftName = metadata.name;
    nft.description = metadata.description;
    nft.image = metadata.image;
    nft.metadata = metadataUri;
    // console.log('the nft is = ',nft);
    return nft;
};

async function handleTransaction(transaction: SubmittableExtrinsic<ApiTypes>, accountId: string){
    const injectedAccount = await web3FromAddress(accountId);
    const signer = injectedAccount.signer;
    await transaction.signAndSend(accountId, { signer });
}
