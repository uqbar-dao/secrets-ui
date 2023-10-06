import React, { useState } from 'react'
import type { Secret } from '../types'
import SecretBid from './SecretBid'
import { keccak256, toUtf8Bytes } from 'ethers/lib/utils'

const testSecrets = [
  {
    message: 'foo',
    messageHash: keccak256(toUtf8Bytes('foo')),
    from: 'drew.uq',
    topBid: null,
    secret: 'bar',
    time: 123
  },
  { message: 'message 2', messageHash: '0x456', from: 'bob.uq', topBid: null, secret: null, time: 124 },
]

export default function Feed() {
  let [secrets, setSecrets] = useState<Secret[]>(testSecrets)

  return (
    <ul>
      {secrets.map((s) => (
        <SecretBid secret={s}></SecretBid>
      ))}
    </ul>
  )
}