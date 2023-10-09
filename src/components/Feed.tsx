import React, { useState, useEffect } from 'react'
import type { Secret } from '../types'
import SecretBid from './SecretBid'
import { BigNumber } from 'ethers'

export default function Feed() {
  let [secrets, setSecrets] = useState<Secret[]>([])

  useEffect(() => {
    const fetchSecrets = async () => {
      const res = await fetch('/secrets/feed')
      const json = await res.json()
      console.log("json", json['secrets'])
      setSecrets(json['secrets'])
    }

    fetchSecrets()
  }, [])


  return (
    <div className="feed-container">
      <ul>
      {secrets
        .sort((a, b) => BigNumber.from(b.block).sub(BigNumber.from(a.block)).toNumber())
        .map((s) => (
        <SecretBid key={s.message} secret={s}></SecretBid>
        ))
      }
      </ul>
    </div>
  )
}