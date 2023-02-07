import React, { ReactPropTypes, useState } from 'react';
import { Button } from 'semantic-ui-react';

interface CustomNftPropTypes{
    handleFetchNft: (contractAddress: string, tokenId: string|number) => void;
}

const CustomNft = (props: CustomNftPropTypes) => {
    const { handleFetchNft} = props;
    const [ contractAddress, setContractAddress ] = useState('');
    const [ tokenId, setTokenId ] = useState('');
    return (
        <div>
            <div>
               <label>Contract Address</label>
               <input type="text" placeholder="Contract Address" value={contractAddress} onChange={e => setContractAddress(e.target.value)} />
            </div>
            <div>
                <label>Token Id</label>
                <input type="text" placeholder="token id" value={tokenId} onChange={e => setTokenId(e.target.value)} />
            </div>
            <div>
                <Button basic color='purple' onClick={e => handleFetchNft(contractAddress, tokenId)}>Fetch</Button>
            </div>
        </div>
    );
}

export default CustomNft;
