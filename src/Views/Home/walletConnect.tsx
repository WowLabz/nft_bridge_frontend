import React from 'react';
import { Button } from 'semantic-ui-react';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

interface WalletProps {
  type: string,
  setAddress: React.Dispatch<string | InjectedAccountWithMeta>
}

declare global {
  interface Window{
    ethereum: any
  }
}

const ConnectWallet = (props: WalletProps) => {
  const title = "Connect Wallet";

  const { type, setAddress } = props;

  const handleOnClick = async () => {
    try{
      if(type === 'EVM'){
        if(window.ethereum){
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          const account = accounts[0];
          setAddress(account);
        }else{
          alert("Not evm wallet found!");
        }
      }else{
        const injectedExtension = await web3Enable('Socialli');
        if(injectedExtension.length > 0){
          const accounts = await web3Accounts();
          const account = accounts[0];
          setAddress(account);
        }else{
          alert("No polkadot wallet found!");
        }
      }
    }catch(error){
      alert("No wallet extension found!");
      console.error(error);
    }
  }

  return (
    <div>
      <Button
        basic
        color="yellow"
        onClick={ (e) => handleOnClick() }
      >
        {title}
      </Button>
    </div>
  );
}

export default ConnectWallet;
