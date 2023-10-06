import React, { useState, useEffect } from 'react';
import { hooks } from "./connectors/metamask";
import { SECRETS_ADDRESSES } from "./constants/addresses";
import { Secrets__factory } from "./abis/types";
import ConnectWallet from "./components/ConnectWallet";
import { toDNSWireFormat } from "./utils/dnsWire";
import { ethers } from 'ethers'

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
    console.log('foo')

    if (!provider || !chainId) {
      window.alert('Please connect your wallet to Sepolia')
      return false
    }

    let secretsAddress = SECRETS_ADDRESSES[chainId];
    let secretsContract = Secrets__factory.connect(secretsAddress, provider.getSigner());

    const messageBytes = ethers.utils.toUtf8Bytes(message);
    const secretBytes = ethers.utils.toUtf8Bytes(secret);
    const combinedBytes = ethers.utils.concat([messageBytes, secretBytes]);
    const commitHash = ethers.utils.keccak256(combinedBytes);
  
    let signature = await provider.getSigner().signMessage(commitHash)

    let tx = await secretsContract.commitSecret(message, signature, toDNSWireFormat(ourName))
    await tx.wait();

    console.log('done', tx.hash)
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
    </>
  );
}

export default App;
