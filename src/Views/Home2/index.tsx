import React, { useEffect, useState } from 'react';
import ConnectWalletModal from './ConnectWalletModal';
import SelectModal, { ChainType, ModalData } from './SelectModal';
import { connect } from 'react-redux';
import { CombineReducerType } from '../../reducers';
import { setSourceChain } from '../../actions';

interface HomePropsType {
    sourceChain: ChainType;
    setSourceChain: (chain: ChainType) => any;
}

const Home = (props: any) => { // not able to assign HomePropsType to this

    const { setSourceChain } = props;

    const [ openModal, setOpenModal ] = useState(false);
    const [ openWalletModal, setOpenWalletModal ] = useState(false);
    const [ modalData, setModalData ] = useState({source:false, heading: ''});
    const [ source, setSource ] = useState('');
    const [ target, setTarget ] = useState('');

    const options = [
        {
            id: 1,
            name: "Polygon",
            value: "Polygon",
            icon: './static/polygon-icon.svg'
        },
        {
            id: 2,
            name: "Polkadot",
            value: "Polkadot",
            icon: './static/polkadot-icon.svg'
        }
    ];

    const onChainSelectClick = (source: boolean, heading: string) => {
        const tempModalData: ModalData = {
            source,
            heading
        };
        setModalData(tempModalData);
        // setHeading(heading);
        setOpenModal(true);
    }

    useEffect(() => {
        if(source){
            const tmpSource = options.find(option => option.value === source);
            if(tmpSource && tmpSource.id){
                setSourceChain(tmpSource)
            }
        }
    }, [source])

    return (
        <div className="text-center flex flex-col items-center justify-center h-screen rounded-xl">
            <div className=" w-[500px] h-[600px] bg-white rounded-lg shadow-md border-2 text-center flex flex-col items-center justify-center">
            <div>
                <h1 className="font-bold text-[24px]">Transfer NFTs between Polkadot and Polygon</h1>
            </div>
            <div className="p-4">
                <div className="my-4">
                    <div><label className="text-[20px]">Departure Chain</label></div>
                   <div><button className="modalButton" onClick={() => onChainSelectClick(true, "Select Departure Chain")}>{source ? source : "Select Departure Chain"}</button></div>
                </div>
                <div className="my-4">
                    <div><label className="text-[20px]">Destination Chain</label></div>
                    <div><button disabled={!source} className="modalButton disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => onChainSelectClick(false, "Select Destination Chain")}>{target ? target : "Select Destination Chain"}</button></div>
                </div>
            </div>
            <div className={!(source && target) ? "hidden" : ""}>
            <button onClick={() => setOpenWalletModal(true)} className="border-solid border-2 h-[50px] w-[150px] rounded-xl hover:opacity-75 bg-green-600 text-slate-50">Continue</button>
            </div>
            <div><SelectModal open={openModal} setOpen={setOpenModal} data={modalData} options={options} source={source} setSource={setSource} setTarget={setTarget} /></div>
            <div><ConnectWalletModal open={openWalletModal} setOpen={setOpenWalletModal}/></div>
            </div>
        </div>
    );
}

const mapStateToProps = (state: CombineReducerType) => {
    return { sourceChain: state.sourceChainReducer };
}

export default connect(mapStateToProps, { setSourceChain })(Home);
