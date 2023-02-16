import { ChainType } from "@polkadot/types/interfaces"

export const connectEth = (eth: any) => {
    return {
        type: 'ETH',
        payload: eth
    }
}

export const connectPolka = (polka: any) => {
    return {
        type: 'POL',
        payload: polka
    }
}

export const setSourceChain = (sourceChain: ChainType) => {
    return {
        type: 'SOURCE',
        payload: sourceChain
    }
}
