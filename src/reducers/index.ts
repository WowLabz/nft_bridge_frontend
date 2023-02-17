import { combineReducers } from 'redux';
import { ChainType } from '../Views/Home2';

interface ActionType {
    type: string;
    payload: any;
}

export interface CombineReducerType {
    ethWalletReducer: any;
    polkaWalletReducer: any;
    sourceChainReducer: ChainType
}


const ethWalletReducer = (ethWallet = null, action: ActionType) => {
    if(action.type === 'ETH'){
        return action.payload
    }
    return ethWallet
}

const polkaWalletReducer = (polkaWallet = null, action: ActionType) => {
    if(action.type === 'POL'){
        return action.payload
    }
    return polkaWallet
}

const sourceChainReducer = (sourceChain: ChainType, action: ActionType) => {
    if(action.type === 'SOURCE') {
        return action.payload;
    }
    return sourceChain ? sourceChain : null;
}

export default combineReducers({
    ethWalletReducer,
    polkaWalletReducer,
    sourceChainReducer
})
