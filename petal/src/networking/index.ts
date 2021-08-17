const Libp2p = require('libp2p')
const TCP = require('libp2p-tcp')
const { NOISE } = require('libp2p-noise')
const MPLEX = require('libp2p-mplex')
const multiaddr = require('multiaddr')
const Gossipsub = require('libp2p-gossipsub')

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

  const topic = 'bloom-test'
  const gossip = await startGossip(node, topic)
  gossip.on(topic, handleGossip)
  await gossip.publish(topic, new TextEncoder().encode('stickykeys here!'))

  // await node.stop()
  // console.log('Stopped libp2p')
}

async function startGossip(node, topic) {
  const gsub = new Gossipsub(node, {emitSelf: true})
  gsub.start()
  gsub.subscribe(topic)
  return gsub
}

async function handleGossip(message) {
  switch (message.typ) {
    case "blk":
      // verify and add it to my chain
      break;
    case "tx":
      // verify and add it to my tx pool, then maybe mine
      break;
    default:
      break;
  }
}

async function startMining() {

}

main().then(() => {
  process.exit()
}).catch(e => {
  console.error(e)
  process.exit(1)
})

