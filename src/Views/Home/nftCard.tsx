import React from 'react';
import { Card, Image, Button } from 'semantic-ui-react';


export interface NftType {
    collectionId: null | number | string,
    nftId: number | string,
    metadata: string,
    contractAddress: null | string,
    owner: string
}

interface NftCardProps {
    nft: NftType;
    handleTransfer: (nft: NftType) => void;
}

const NftCard = ( props: NftCardProps ) => {
    const { nft, handleTransfer } = props;

    return (
        <Card>
            <Image src={nft.metadata}/>
            <Card.Content extra>
            <Button basic color="green" onClick={() => handleTransfer(nft)}>
                    Transfer
                 </Button>
            </Card.Content>
        </Card>
    );
}
export default NftCard;
