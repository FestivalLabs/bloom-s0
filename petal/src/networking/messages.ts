interface Message {
    kind: string;
    data: BlockData | TransactionData;
}

interface BlockData extends Message {
    block: Block;
    blockHash: string;
}

interface TransactionData {
    transaction: Transaction;
    transactionHash: string;
}

function createBlockMessage(blockData: BlockData): Message {
    return { kind: "blk", data: blockData }
}

function createTransactionMessage(transactionData: TransactionData): Message {
    return { kind: "tx", data: transactionData }
}
