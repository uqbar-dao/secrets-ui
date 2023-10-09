import React, { useState, useEffect } from 'react';
import { hooks } from "./connectors/metamask";
import { SECRETS_ADDRESSES } from "./constants/addresses";
import { Secrets__factory } from "./abis/types";
import ConnectWallet from "./components/ConnectWallet";
import Feed from './components/Feed';
import { toDNSWireFormat } from "./utils/dnsWire";
import { ethers } from 'ethers'
import { ChainId } from './constants/chainId';

const {
  useChainId,
  useAccounts,
  useProvider,
} = hooks;

function App() {
  let chainId = useChainId();
  let accounts = useAccounts();
  let provider = useProvider();
  const [message, setMessage] = useState('')
  const [secret, setSecret] = useState('')
  const [ourName, setOurName] = useState('drew.uq') // TODO

  // useEffect(() => {}, []) // TODO get ourName
  
  const postSecret = async () => {
    console.log('post secret')

    if (!provider || !chainId || chainId != ChainId.SEPOLIA) {
      window.alert('Please connect your wallet to Sepolia')
      return false
    }

    // TODO if secret was already posted, reject here rather than later!

    await fetch('/secrets/save-secret', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // NOTE if this is used for other TLDs we have to change .uq
      body: JSON.stringify({ message, secret })
    })

    console.log('after fetch')

    let secretsAddress = SECRETS_ADDRESSES[chainId];
    let secretsContract = Secrets__factory.connect(secretsAddress, provider.getSigner());

    const bytesToSign = ethers.utils.solidityPack(
      ['string', 'string'],
      [message, secret]
    )
    let signature = await provider.getSigner().signMessage(ethers.utils.arrayify(bytesToSign))

    let tx = await secretsContract.commitSecret(message, signature, toDNSWireFormat(ourName))
    await tx.wait();

    console.log('done', tx.hash)
    window.alert(`success! here is your transaction hash: ${tx.hash}`)
  }

  // const revealSecret = async () => {
  //   console.log('bar')

  //   if (!provider || !chainId) {
  //     window.alert('Please connect your wallet to Sepolia')
  //     return false
  //   }

  //   let secretsAddress = SECRETS_ADDRESSES[chainId];
  //   let secretsContract = Secrets__factory.connect(secretsAddress, provider.getSigner());


  // }

  return (
    <>
      {
        !chainId?  <ConnectWallet /> :
        !provider? <ConnectWallet /> :
        !(chainId in SECRETS_ADDRESSES)? <p>change networks</p> :
        <>
          <div>
            {/* post bar at the top to make a new secret */}
            { accounts && <p>{accounts[0]}</p> }
            <input id="message" value={message} onChange={e => setMessage(e.target.value)} />
            <label htmlFor="message">Message</label>
            <input id="secret" value={secret} onChange={e => setSecret(e.target.value)} />
            <label htmlFor="secret">Secret</label>
            <button onClick={postSecret}>Set Secret</button>
          </div>
          <div>
            {/* feed of all secrets */}
          </div>
        </>
      }
      <Feed />
    </>
  );
}

export default App;
