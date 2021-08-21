require("dotenv").config();
const bip39 = require("bip39");
const { ethers } = require("@nomiclabs/buidler");
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.S3_REGION,
});

const AWS_BUCKET_NAME: string = process.env.AWS_BUCKET_NAME || "";
const KEYSTORE_PASSWORD = process.env.KEYSTORE_PASSWORD || "";
const NETWORK = process.env.NETWORK || "local";

async function main(): Promise<any> {
  const { mnemonic } = generateHDWallet();
  const {
    keystore: masterKeystore,
    keystoreJSON: masterKeystoreJSON,
  } = await generateMasterKeystore(mnemonic);

  const generator = keystoreGenerator(mnemonic);
  const first = await generator.next().value;

  console.log("\nUploading keystore files to s3");
  await uploadKeystoreToS3(
    AWS_BUCKET_NAME + `/${NETWORK}`,
    masterKeystoreJSON["x-ethers"].gethFilename,
    masterKeystore
  );
  await uploadKeystoreToS3(
    AWS_BUCKET_NAME + `/${NETWORK}`,
    "hot/" + first.keystoreJSON["x-ethers"].gethFilename,
    first.keystore
  );

  console.log(`\nexport HOT_WALLET_ADDRESS=${first.address}`);
  console.log("\nDone");
}

function generateHDWallet(): {
  mnemonic: string;
  firstDerivationPath: string;
  firstAddress: string;
} {
  const mnemonic = bip39.generateMnemonic();
  // m / purpose' / coin_type' / account' / change / address_index
  let firstDerivationPath = "m/44'/60'/0'/0/0";
  let firstAddress = "";
  if (bip39.validateMnemonic(mnemonic)) {
    const masterNode = ethers.utils.HDNode.fromMnemonic(mnemonic);
    let node = masterNode.derivePath(firstDerivationPath);
    firstAddress = node.address;
  }
  console.log("Mnemonic:");
  console.log(mnemonic + "\n");
  console.log("First derivation path:");
  console.log(firstDerivationPath + "\n");
  console.log("First address:");
  console.log(firstAddress + "\n");
  return { mnemonic, firstDerivationPath, firstAddress };
}

async function generateMasterKeystore(
  mnemonic: string
): Promise<{ keystore: string; keystoreJSON: any }> {
  console.log("Generating master keystore file");
  return await generateKeystore(mnemonic, "m");
}

/**
 * Returns a promise that generates a keystore file.
 * @param mnemonic 12 word mnemonic
 */
function* keystoreGenerator(mnemonic: string): Generator {
  const derivationRoot = "m/44'/60'/0'/0/";
  let index = 0;
  while (true) {
    let derivationPath = derivationRoot + String(index);
    index++;
    yield generateKeystore(mnemonic, derivationPath);
  }
}

async function generateKeystore(
  mnemonic: string,
  derivationPath: string
): Promise<{ keystore: string; keystoreJSON: any; address: string }> {
  const wallet = ethers.Wallet.fromMnemonic(mnemonic, derivationPath);
  console.log(wallet.address);
  const keystore = await wallet.encrypt(
    KEYSTORE_PASSWORD,
    (progress: number) => {
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(
        "Encrypting: " + parseInt((progress * 100).toString()) + "% complete"
      );
    }
  );
  process.stdout.write("\n");
  const keystoreJSON = JSON.parse(keystore);
  return { keystore, keystoreJSON, address: wallet.address };
}

async function uploadKeystoreToS3(
  bucketName: string,
  fileName: string,
  keystore: string
) {
  const keyName = `keys/${fileName}`;
  await uploadToBucket(bucketName, keyName, keystore);
}

async function uploadToBucket(
  bucketName: string,
  keyName: string,
  body: string
) {
  const params = { Bucket: bucketName, Key: keyName, Body: body };
  const uploadPromise = s3.putObject(params).promise();
  await uploadPromise
    .then(() => {
      console.log(
        "Successfully uploaded data to " + bucketName + "/" + keyName
      );
    })
    .catch(throwForFailure);
}

/**
 * Throws error with `message`.
 * @param {string} message
 */
function throwForFailure(message: string) {
  throw Error(message);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
