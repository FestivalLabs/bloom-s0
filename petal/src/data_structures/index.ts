interface Block {
    header: IBlockHeader;
    blockHeaderHash: string;
    merkleTreeTransactions: Array<Transaction>;
}

interface IBlockHeader extends ServiceString {
    nonce: number; // 32-bit number (approx. 4M)
}

interface ServiceString {
    version: number;
    prevBlockHash: string;
    merkleRootHash: string;
    unixTimestamp: number;
    blockHashTarget: string;
}

interface Transaction {
    version: number;
    to: Array<string>;
    from: string;
    amounts: Array<number>;
}

/**
 * The coinbase is always the first transaction in the block,
 * and the leftmost leaf in the merkle tree.
 */
interface CoinbaseTransaction extends Transaction {
    extraNonce: number;
}

class BlockHeader implements IBlockHeader {
    version;
    prevBlockHash;
    merkleRootHash;
    unixTimestamp;
    blockHashTarget;
    nonce;

    constructor(prevBlockHash: string, merkleRootHash: string, blockHashTarget: string, nonce: number) {
      this.version = 0;
      this.prevBlockHash = prevBlockHash;
      this.merkleRootHash = merkleRootHash;
      this.unixTimestamp = Date.now();
      this.blockHashTarget = blockHashTarget;
      this.nonce = nonce;
    }

    public stringify() {
        return `${this.version}${this.prevBlockHash}${this.merkleRootHash}${this.unixTimestamp}${this.blockHashTarget}${this.nonce}`;
    }
}
