import sjcl from 'sjcl';

const uint32Max = 2**32 - 1;

/**
 * Returns the hash of the block meeting the target difficulty
 * @param blockHeader 
 */
function naiveMine(
  prevBlockHash: string,
  merkleRootHash: string,
  blockHashTarget: string
): string {
  let blockHash;
  let nonce = 0;
  while (!blockHash.stratsWith(blockHashTarget)) {
    nonce++;
    const preimage = `${prevBlockHash}${merkleRootHash}${nonce}`;
    blockHash = sjcl.hash.sha256.hash(preimage);
  }
  return blockHash;
}

/**
 * Returns the hash of the block header meeting the target difficulty
 */
function hashcash_AdamBack_1997(
  block: Block,
  prevBlockHash: string,
  blockHashTarget: string
): { blockHash: string, blockHeader: BlockHeader, nonce: number} {

  let blockHeader;
  let nonce = -1; // 32-bit uint
  let extraNonce = 0;
  let blockHash;
  let merkleRootHash = createMerkleRoot(block.merkleTreeTransactions, extraNonce);

  while (!blockHash.startswith(blockHashTarget)) {
    nonce++;
    if (nonce > uint32Max) {
      nonce = 0;
      extraNonce++;
      merkleRootHash = createMerkleRoot(block.merkleTreeTransactions, extraNonce);
    }
    blockHeader = createBlockHeader(prevBlockHash, merkleRootHash, blockHashTarget, nonce);
    blockHash = doubleSha256(blockHeader.stringify());
  }

  return {blockHash, blockHeader, nonce}
}

function createBlockHeader(prevBlockHash: string, merkleRootHash: string, blockHashTarget: string, nonce: number): BlockHeader {
  return new BlockHeader(prevBlockHash, merkleRootHash, blockHashTarget, nonce);
}

function doubleSha256(preimage: string): string {
  const bitArray = sjcl.hash.sha256.hash(preimage)
  const bitArray2 = sjcl.hash.sha256.hash(bitArray)
  return sjcl.codec.hex.fromBits(bitArray2)
}
