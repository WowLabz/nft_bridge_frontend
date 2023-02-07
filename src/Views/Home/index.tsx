import React, { useState } from 'react';
import Bridge from './Bridge';

const Home = () => {

    const [ account, setAccount ] = useState(null);
    const [ sourceChain, setSourceChain ] = useState('');
    const [ destChain, setDestChain ] = useState('');
    const [ targetAddress, setTargetAddres ] = useState('');

    const allOptions = [
        {
            key: 1,
            text: "Ethereum",
            value: "EVM"
        },
        {
            key: 2,
            text: "Polkadot",
            value: "PLK"
        }
    ];

    const sourceOptions = allOptions.filter(value => destChain !== value.value);
    const destOptions = allOptions.filter(value => sourceChain !== value.value);

    console.log("account = ", account);


    return (
        <div>
            <div>
                <header>NFT Bridge</header>
            </div>
            <Bridge
                sourceOptions={sourceOptions}
                destOptions={destOptions}
                account={account}
                setAccount={setAccount}
                setSourceChain={setSourceChain}
                setDestChain={setDestChain}
                sourceChain={sourceChain}
                destChain={destChain}
                targetAddress={targetAddress}
                setTargetAddress={setTargetAddres}
                type={sourceChain}
            />
        </div>
    );
}

export default Home;
