import axios from "axios";
import { CONSTANTS } from "../constants/constants";
import { approveNft } from "../service/ethereum";
import { transferUserNftToSelf } from "../service/polkadot";
import { NftType } from "../Views/Transfer";



export async function ethereumToPolkadot(nft: NftType, account: string, receiver: string): Promise<boolean> {
    console.log("Ethereum to polkadot handler called!");
    if(!nft.contractAddress) return false;
    await approveNft(nft.contractAddress, nft.tokenId, account);
    console.log("approved!");
    const URI = CONSTANTS.ETHTOPOLKAURI;
    const result = await axios.post(URI, {
        contractAddress: nft.contractAddress,
        tokenId: nft.tokenId,
        owner: nft.owner,
        receiver: receiver
    });
    console.log("Here is the result after ethToPolka = ",result);
    return result.status === 200 || result.status === 201;
}

export async function polkadotToEthereum(nft: NftType, account: any, receiver: string): Promise<boolean> {
    console.log("Polkadot to ethereum handler is called! with values = ",nft,account,receiver);
    if(!nft.collectionId) return false;
    await transferUserNftToSelf(nft.collectionId, nft.tokenId, account);
    await delay(6000);
    console.log("nft transferred to self");
    const URI = CONSTANTS.POLKATOETHURI;
    const result = await axios.post(URI, {
        owner: receiver,
        collectionId: nft.collectionId,
        tokenId: nft.tokenId
    });
    console.log("Here is the result after polkaToEth = ",result);
    return result.status === 200 || result.status === 201;
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
