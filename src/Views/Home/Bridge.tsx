import React, { useEffect, useState } from 'react';
import { Dropdown, Loader } from 'semantic-ui-react';
import { ethereumToPolkadot, polkadotToEthereum } from '../../controller/nftTransferController';
import { NftType } from '../Transfer';
import NftsOwned from './NftsOwned';

import ConnectWallet from './walletConnect';


interface OptionsObject {
    key: number,
    text: string,
    value: string,
}

interface BridgeProps {
    sourceOptions: OptionsObject[],
    destOptions: OptionsObject[],
    account: string | any | any[],
    setAccount: React.Dispatch<React.SetStateAction<any>>,
    setSourceChain: React.Dispatch<React.SetStateAction<string>>,
    setDestChain: React.Dispatch<React.SetStateAction<string>>,
    sourceChain: string,
    destChain: string,
    targetAddress: string,
    setTargetAddress: React.Dispatch<React.SetStateAction<string>>,
    type: string
}

const Bridge = (props: BridgeProps) => {
    const { sourceOptions, destOptions, sourceChain, account, setAccount,type, setSourceChain, setDestChain, targetAddress, setTargetAddress } = props;
    const [ nftVisibility, setNftVisibility ] = useState("none")
    const [ loadingState, setLoadingState ] = useState(false);

    useEffect(() => {
        if(account){
            setNftVisibility("flex")
        }else{
            setNftVisibility("none")
        }
    }, [account])

    const handleTransfer = async(nft: NftType) => {
        console.log("Handle transfer called! with nft : ",nft);
        try{
            if(nft.collectionId !== null){
                // polka to eth controller
                const callingAccount = typeof account === typeof "" ? account : account.address;
                setLoadingState(true);
                const result = await polkadotToEthereum(nft, callingAccount, targetAddress);
                setLoadingState(false);
                if(result){
                    alert("Nft transfer success!");
                }else{
                    alert("Nft transfer failed!");
                }
            }else{
                // eth to polka controller
                const callingAccount = typeof account === typeof "" ? account : account.address;
                setLoadingState(true);
                const result = await ethereumToPolkadot(nft, callingAccount, targetAddress);
                setLoadingState(false);
                if(result){
                    alert("Nft transfer success!");
                }else{
                    alert("Nft transfer failed!");
                }
            }

        }catch(e){
            console.log("error: ",e);
            setLoadingState(false);
        }
    }


    if(loadingState){
        return (
            <div>
                <Loader>Loading.....</Loader>
            </div>
        );
    }

    return (
        <div>
            <div>
                <div>
                    <header>Select Source Chain</header>
                    <Dropdown
                        options={sourceOptions}
                        selection
                        placeholder="Choose Source Chain"
                        onChange={(e, { value }) => {
                                        if(value){
                                        setSourceChain(value.toString())
                                        }
                            }}
                    />
                    { sourceChain !== '' && (
                        <ConnectWallet
                            type={sourceChain}
                            setAddress={setAccount}
                        />
                    )}
                </div>
                <div>
                    <header>Select Destination Chain</header>
                    <Dropdown
                        options={destOptions}
                        selection
                        placeholder="Choose Destination Chain"
                        onChange={(e, {value}) => {
                            if(value){
                                setDestChain(value.toString())
                            }
                        }}
                    />
                </div>
                <div>
                    <header>Target Address</header>
            <input type="text" placeholder="Target AccountId" value={targetAddress} onChange={(e) => setTargetAddress(e.target.value)} />
                </div>
            </div>
            { account && (
                <div style={{ display: nftVisibility }}>
                    {/*<NftsOwned  address={typeof account === typeof "" ? account : account.address} type={type} handleTransfer={handleTransfer}/> */}
            </div>
            ) }
        </div>
    );
}

export default Bridge;
