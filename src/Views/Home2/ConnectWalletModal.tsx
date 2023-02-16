import React from 'react';
import { Modal } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { CombineReducerType } from '../../reducers';
import { connectEth, connectPolka } from '../../actions';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { useNavigate } from 'react-router-dom';

interface ConnectWalletModalType {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    ethWallet: any;
    polkaWallet: any;
    connectEth: (eth: any) => any;
    connectPolka: (polka: any) => any;
}

declare global {
  interface Window{
    ethereum: any
  }
}


const ConnectWalletModal = (props: ConnectWalletModalType) => {

    const { open, setOpen, ethWallet, polkaWallet, connectEth, connectPolka } = props;

    const navigate = useNavigate();

    const connectEthereum = async () => {
        if(window.ethereum) {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            const account = accounts[0];
            connectEth(account);
            return navigate("/transfer");
        }else{
            alert("EVM wallet not found!");
        }
        setOpen(false);
    }

    const connectPolkadot = async () => {
        const injectedExtension = await web3Enable('Socialli Bridge');
        if(injectedExtension.length > 0){
            const accounts = await web3Accounts();
            const account = accounts[0];
            connectPolka(account);
            return navigate("/transfer");
        }else{
            alert("Polkadot extension not found!");
        }
        setOpen(false);
    }

    return (
        <Modal
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          style={{textAlign: 'center', width: '400px', height: '500px', borderRadius: '20px'}}
        >
            <Modal.Header>Connect Wallet</Modal.Header>
            <Modal.Content>
                <div>
                    <ul className="overflow-auto">
                        <li className="wlistItem" onClick={() => connectEthereum()}>
                            <img src='./static/metamask-icon.svg' alt="Metamask Icon"/>
                            <p>Metamask</p>
                        </li>
                        <li className="wlistItem" onClick={() => connectPolkadot()}>
                            <img src='./static/polkadot-icon.svg' alt="Polkadot Icon"/>
                            <p>Polkadot</p>
                        </li>
                    </ul>
                </div>
            </Modal.Content>
        </Modal>
    );
}

const mapStateToProps = (state: CombineReducerType) => {
    return { ethWallet: state.ethWalletReducer, polkaWallet: state.polkaWalletReducer };
}

export default connect(mapStateToProps, { connectEth, connectPolka })(ConnectWalletModal);
