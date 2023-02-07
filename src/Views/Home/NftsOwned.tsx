import React, { useState, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { fetchEvmNfts, getCustomTokenDetails } from '../../service/ethereum';
import { fetchUserNfts } from '../../service/polkadot';
import CustomNft from './CustomNft';
import NftCard, { NftType } from './nftCard';

interface NftsOwnedProps {
    address: string;
    type: string;
    handleTransfer: (nft: NftType) => void;
}

const NftsOwned = (props: NftsOwnedProps) => {
    const { address, type, handleTransfer } = props;
    const [ nftCollection, setNftCollection ] = useState<any[]>([]);

    const mapForEvm = (arr: any[]) => {
        const mappedArray = arr.map(value => {
            console.log(value);
            const nft: NftType = {
                nftId: value.token_id,
                collectionId: null,
                metadata: value.image_url,
                contractAddress: value.asset_contract.address,
                owner: address
            }
            console.log('created this nft: ', nft);
            return nft
        })
        setNftCollection(mappedArray)
    }

    const mapForPolka = (arr: any[]) => {
        const mappedArray = arr.map(value => {
            console.log('value = ', value);
            const nft: NftType = {
                collectionId: value.collectionId,
                nftId: value.nftId,
                metadata: value.metadata,
                contractAddress: null,
                owner: address
            }
            console.log('created this nft: ', nft);
            return nft;
        })
        setNftCollection(mappedArray)
    }
    // const init = async () => {
    //     const nfts = await fetchEvmNfts(address);
    //     if(nfts.length > 0){
    //         if(type === 'EVM') mapForEvm(nfts)
    //         else mapForPolka(nfts)
    //     }
    // }
    useEffect(() => {
        const init = async () => {
        // const nfts = await fetchEvmNfts(address);
        // if(nfts.length > 0){
        //     if(type === 'EVM') mapForEvm(nfts)
        //     else mapForPolka(nfts)
        // }
        let nfts;
        if(type === 'EVM') {
            nfts = await fetchEvmNfts(address);
            mapForEvm(nfts);
        }else{
            nfts = await fetchUserNfts(address);
            mapForPolka(nfts);
        }

    }
        init();
    }, [address, type])

    const handleCustomNft = async(contractAddress: string, tokenId: number | string) => {
        const nft = await getCustomTokenDetails(contractAddress, tokenId);
        if(nft === null){
            return;
        }
        console.log(`current address = ${address} nft owner address = ${nft.owner}`);
        if(nft.owner.toUpperCase() === address.toUpperCase()){
            console.log("Nft owner is the same")
            setNftCollection([...nftCollection, nft]);
        }
    }


    if(nftCollection.length === 0){
        return (<div>"You don\'t own any nfts'"</div>)
    }
    return (
        <div>
            <div>
                <Grid columns={3} divided>
                    <Grid.Row>
                        {nftCollection.map(nft => {
                            return <NftCard nft={nft} handleTransfer={handleTransfer}/>
                            })}
                    </Grid.Row>
                </Grid>
            </div>
            <div>
                <CustomNft handleFetchNft={handleCustomNft} />
            </div>
        </div>
    );
}

export default NftsOwned;
