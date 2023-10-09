import { ChainId } from './chainId'

type AddressMap = { [chainId: number]: string }

export const SECRETS_ADDRESSES : AddressMap = {
    [ChainId.SEPOLIA]: '0xfd571a1a8Ba4bAe58f5729aF52E2ED7277ed3DF2',
}

export const WETH_ADDRESSES : AddressMap = {
    [ChainId.SEPOLIA]: '0x7b79995e5f793a07bc00c21412e50ecae098e7f9',
}
