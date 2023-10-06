import React, { useState, useEffect } from 'react'
import type { Secret } from '../types'
import { hooks } from "../connectors/metamask";
import { ChainId } from '../constants/chainId';
import { SECRETS_ADDRESSES, WETH_ADDRESSES } from "../constants/addresses";
import { Secrets__factory, WETH__factory } from "../abis/types";
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { toDNSWireFormat } from '../utils/dnsWire';

const {
  useChainId,
  useAccounts,
  useProvider,
} = hooks;

type SecretBidProps = {
  secret: Secret
}

export default function SecretBid({ secret }: SecretBidProps) {
  let chainId = useChainId();
  let accounts = useAccounts();
  let provider = useProvider();
  let [ourName, setOurName] = useState('drew.uq') // TODO
  let [bidRaw, setBidRaw] = useState('')
  let [bidAmount, setBidAmount] = useState(BigNumber.from(0)) // TODO need to add a big number to string conversion here

  useEffect(() => {
    if (!bidRaw) return
    // console.log(parseEther(bidRaw))
    setBidAmount(parseEther(bidRaw))
  }, [bidRaw])

  const submitBid = async () => {
    if (!provider || !chainId || chainId !== ChainId.SEPOLIA) {
      window.alert('Please connect your wallet to Sepolia')
      return false
    }

    let secretsAddress = SECRETS_ADDRESSES[chainId];
    let secretsContract = Secrets__factory.connect(secretsAddress, provider.getSigner());
    
    let wethAddress = WETH_ADDRESSES[chainId];
    let wethContract = WETH__factory.connect(wethAddress, provider.getSigner());
    // TODO WETH CHECKS HERE
    let balance = await wethContract.balanceOf(accounts![0]);
    if (balance.lt(bidAmount)) {
      let tx = await wethContract.deposit({ value: bidAmount })
      await tx.wait();
    }

    let allowance = await wethContract.allowance(accounts![0], secretsAddress);
    if (allowance.lt(bidAmount)) {
      let tx = await wethContract.approve(secretsAddress, bidAmount)
      await tx.wait();
    }
    let tx = await secretsContract.placeBid(secret.messageHash, bidAmount, toDNSWireFormat(ourName))
    await tx.wait();
  }

  const revealSecret = async () => {
    if (!provider || !chainId) {
      window.alert('Please connect your wallet to Sepolia')
      return false
    }

    if (!secret.secret) {
      window.alert('No secret to reveal')
      return false
    }

    let secretsAddress = SECRETS_ADDRESSES[chainId];
    let secretsContract = Secrets__factory.connect(secretsAddress, provider.getSigner());

    let tx = await secretsContract.revealSecret(secret.message, secret.secret!, toDNSWireFormat(ourName))
    await tx.wait();
  }

  return (
    <li key={secret.messageHash}>
      <p>{secret.message} - {secret.from}</p>
      <div>
        {
          secret.from == ourName? (
            <button onClick={revealSecret}>Reveal</button>
          ): (
            <>
              <input
                value={bidRaw}
                onChange={e => {
                  if (!isNaN(e.target.value as any)) setBidRaw(e.target.value) // TODO as any
                }}>
              </input>
              <button onClick={submitBid}>Bid</button>
            </>
          )
        }
      </div>
    </li>
  )
}