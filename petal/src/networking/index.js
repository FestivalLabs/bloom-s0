const Libp2p = require('libp2p')
const TCP = require('libp2p-tcp')
const { NOISE } = require('libp2p-noise')
const MPLEX = require('libp2p-mplex')
const multiaddr = require('multiaddr')

async function main() {
  const node = await Libp2p.create({
    addresses: {
      listen: ['/ip4/127.0.0.1/tcp/0']
    },
    modules: {
      transport: [TCP],
      connEncryption: [NOISE],
      streamMuxer: [MPLEX]
    }
  })

  await node.start()
  console.log('Started libp2p')

  console.log('Listening on addresses:')
  node.multiaddrs.forEach((addr) => {
    console.log(addr)
    console.log(`${addr.toString()}/p2p/${node.peerId.toB58String()}`)
  })

  await node.stop()
  console.log('Stopped libp2p')
}

main().then(() => {
  process.exit()
}).catch(e => {
  console.error(e)
  process.exit(1)
})

