import { ChainId } from './chainId'

type AddressMap = { [chainId: number]: string }

export const SECRETS_ADDRESSES : AddressMap = {
    [ChainId.SEPOLIA]: '0x79c3e8Fe22579c7a00E9C1c2130a2F628D3D636D',
}

export const WETH_ADDRESSES : AddressMap = {
    [ChainId.SEPOLIA]: '0x7b79995e5f793a07bc00c21412e50ecae098e7f9',
}
