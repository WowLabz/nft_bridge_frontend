import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'semantic-ui-react';
import { ethereumToPolkadot, polkadotToEthereum } from '../../controller/nftTransferController';
import { CombineReducerType } from '../../reducers';
import { fetchEvmNfts, getCustomTokenDetails } from '../../service/ethereum';
import { fetchUserNfts } from '../../service/polkadot';
import { ChainType } from '../Home2/SelectModal';
import ImportModal from './ImportModal';
import NftCard from './NftCard';

interface TransferType {
    sourceChain: ChainType;
    ethWallet: any;
    polkaWallet: any;
}

export interface NftType {
    collectionId?: string;
    tokenId: string | number;
    contractAddress?: string;
    metadata: string;
    owner: string;
    image: string;
}

interface SuccessType {
    success: boolean;
    open: boolean;
}

interface SuccessModalProp {
    successObject: SuccessType;
    setOpen: React.Dispatch<React.SetStateAction<SuccessType>>;
}

const SuccessModal = (props: SuccessModalProp) => {
    const { successObject, setOpen } = props;
    const { success, open } = successObject;
    const message = success ? "Nft transfer success!" : "Nft transfer failed!";
    return(
        <Modal
            open={open}
            onClose={e => setOpen({success: false, open: false})}
            onOpen={e => setOpen({...successObject, open: false})}
            style={{width: '300px', height: '100px', display: 'flex', alignItems: 'center', textAlign: 'center', justifyContent: 'center'}}
        >
            <Modal.Content>
                <div>
                    <p>{message}</p>
                    <button
                        className="w-[99px] h-[46px] border-solid border-2 border-[#395feb] text-[#395feb] rounded-[40px]"
                        onClick={e => setOpen({success: false, open: false})}
                    >
                        OK
                    </button>
                </div>
            </Modal.Content>
        </Modal>
    );
}

const Transfer = (props: TransferType) => {
    const { sourceChain, ethWallet, polkaWallet } = props;
    const navigate = useNavigate();

    const defaultSelectedNft: NftType = {
        collectionId:'',
        tokenId:'',
        contractAddress:'',
        metadata: '',
        owner: '',
        image: ''
    }

    const [ openImportModal, setOpenImportModal ] = useState<boolean>(false);
    const [ nftCollection, setNftCollection ] = useState<NftType[]>([]);
    const [ selectedNft, setSelectedNft ] = useState<NftType>(defaultSelectedNft);
    const [ destinationAddress, setDestinationAddress ] = useState<string>('');
    const [ openSuccessModal, setOpenSuccessModal ] = useState<SuccessType>({
        open: false,
        success: false,
    });
    const [ loadingImage, setLoadingImage ] = useState<boolean>(false);
    const [ nftsLoading, setNftsLoading ] = useState<boolean>(true);

    // if(!sourceChain || !sourceChain.icon){
    //     return navigate('/');
    // }


    const mapForEvm = (nftArray: any[]) => {
        const mappedArray = nftArray.map(value => {
            const nft: NftType = {
                tokenId: value.token_id,
                metadata: value.token_metadata,
                contractAddress: value.asset_contract.address,
                owner: ethWallet,
                image: value.image_url
            }
            return nft
        })
        setNftCollection(mappedArray);
    }

    const mapForPolka = (nftArray: any[]) => {
        const mappedArray = nftArray.map(value => {
            const nft: NftType = {
                collectionId: value.collectionId,
                tokenId: value.nftId,
                metadata: value.metadata,
                owner: polkaWallet.address,
                image: value.image
            }
            return nft;
        })
        setNftCollection(mappedArray)

    }

    const handleAddCustomToken = async(contractAddress: string, tokenId: string | number) => {
        const customToken = await getCustomTokenDetails(contractAddress, tokenId);
        if(customToken){
            const tempNftCollection = [...nftCollection];
            tempNftCollection.push(customToken);
            setNftCollection(tempNftCollection);
        }
    }

    const handleTransfer = async () => {
        switch(sourceChain.value) {
                case "Polygon":
                    // call eth to polka controller
                    setLoadingImage(true);
                    try{
                        const resultEthToPolka = await ethereumToPolkadot(selectedNft, ethWallet, destinationAddress);
                        setLoadingImage(false);
                        setOpenSuccessModal({success: resultEthToPolka, open: true});
                    }catch(error){
                        setLoadingImage(false);
                        setOpenSuccessModal({success: false, open: true});
                        console.log(error);
                    }
                    break;
                case "Polkadot":
                    // call polka to eth controller
                    setLoadingImage(true);
                    try{
                        const resultPolkaToEth = await polkadotToEthereum(selectedNft, polkaWallet.address, destinationAddress);
                        setLoadingImage(false);
                        setOpenSuccessModal({success: resultPolkaToEth, open: true});
                    }catch(error){
                        setLoadingImage(false);
                        setOpenSuccessModal({success: false, open: true});
                        console.log(error);
                    }
                    break;
            }
    }

    useEffect(() => {
        if(!sourceChain){
            return navigate('/')
        }else{
            switch(sourceChain.value) {
                    case "Polygon":
                    setNftsLoading(true);
                    fetchEvmNfts(ethWallet).then(res => {
                        mapForEvm(res);
                    })
                    setNftsLoading(false);
                    break;
                    case "Polkadot":
                    setNftsLoading(true);
                    fetchUserNfts(polkaWallet.address).then(res => {
                        mapForPolka(res);
                    })
                    setNftsLoading(false);
                    break;
                    default:
                    return navigate('/');
            }
        }
    }, [sourceChain, ethWallet, polkaWallet, openSuccessModal]);


    if(!sourceChain){
        return (
            <div>Loading</div>
        );
    }

    const handleAddNft = () => {
        setOpenImportModal(true);
    }

    const inputClassName = "border-solid border-2 border-[#ccccf1] p-[16px] shadow-lg rounded-[20px] w-[100%] h-[46px]";
    const sendButtonClassName = "w-[199px] h-[46px] border-solid border-2 border-[#395feb] text-[#395feb] rounded-[40px] hover:bg-[#395feb] hover:text-[#fff] disabled:opacity-50 disabled:cursor-not-allowed";
    const loadingDivClassName = "absolute blur-none" + ( loadingImage ? "" : " hidden" )
    const mainDivClassName = "text-center flex gap-8 flex-row items-center justify-center h-screen w-screen relative ";
    const nftsDivClassName = "w-[600px] h-[600px] border-2 border-solid rounded-lg shadow-lg overflow-auto" + ( loadingImage ? " blur-lg" : "" );
    const transferDivClassName = "w-[300px] h-[600px] border-2 border-solid rounded-lg shadow-lg" + ( loadingImage ? " blur-lg" : "" );

    console.log('nfts loading = ', nftsLoading);
    return (
        <div className={mainDivClassName}>
            <div className={nftsDivClassName}>
                <div className="my-10 mx-5 flex items-center justify-between">
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-lg flex">
                            Your Nfts on
                            <img className="mx-2" src={sourceChain.icon} /> {sourceChain.value}
                        </p>
            {/* <span className="flex items-center justify-center"> */}
                                  {/* </span> */}
                    </div>
                    <div className="border-solid border-2 rounded-full flex hover:cursor-pointer items-center justify-center w-[37px] h-[37px]" onClick={handleAddNft}>
                        <img src='./static/add-nft-icon.svg' />
                    </div>
                    <div>
                    </div>
                </div>
                <div className="flex flex-wrap relative" onClick={e => setSelectedNft(defaultSelectedNft)}>
                     { nftCollection.map((nft,index) => <NftCard key={index} nft={nft} selectedNft={selectedNft} setSelectedNft={setSelectedNft} />) }
                    <div className={(nftCollection.length === 0 && !nftsLoading ) ? "" : "hidden"}>
                        <p>You dont have nfts</p>
                    </div>
                    <div className={nftsLoading ? "absolute" : "hidden"}>
                        <img src="./static/loading-nfts.gif"/>
                    </div>
                </div>
            </div>
            <div className={transferDivClassName}>
                <div className="my-10 mx-5 text-center">
                    <h3>Destination</h3>
                    <input
                        type="text"
                        className={inputClassName}
                        value={destinationAddress}
                        onChange={ e => setDestinationAddress(e.target.value)}
                        placeholder="Paste destination address"
                    />
                </div>
                <div>
                    <button
                        disabled={!selectedNft.tokenId || !destinationAddress}
                        className={sendButtonClassName}
                        onClick={handleTransfer}
                    >
                        Send
                    </button>
                </div>
            </div>
            <div>
                <ImportModal
                    open={openImportModal}
                    setOpen={setOpenImportModal}
                    handleAddCustomToken={handleAddCustomToken}
                />
                <SuccessModal successObject={openSuccessModal} setOpen={setOpenSuccessModal} />
            </div>
            <div className={loadingDivClassName}>
                <img src="./static/loading.gif" />
            </div>
        </div>
    );
};

const mapStateToProps = (state: CombineReducerType) => {
    return { sourceChain: state.sourceChainReducer, ethWallet: state.ethWalletReducer, polkaWallet: state.polkaWalletReducer }
}

export default connect(mapStateToProps)(Transfer);
