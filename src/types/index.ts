export type Bid = {
    from: string,
    amount: number, // TODO bignumber bc wei
    time: number, // block number
}

export type Secret = {
    from: string,
    message: string,
    messageHash: string,
    topBid: Bid | null,
    secret: string | null
    time: number,
}
