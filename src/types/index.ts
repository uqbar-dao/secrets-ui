export type Bid = {
    from: string,
    amount: string, // TODO bignumber bc wei
    block: string, // block number
}

export type Secret = {
    from: string,
    message: string,
    messageHash: string,
    topBid: Bid | null,
    secret: string | null
    block: string,
}
