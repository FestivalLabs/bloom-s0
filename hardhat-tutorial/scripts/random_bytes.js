// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { keccak256 } = require("@ethersproject/keccak256");
const { randomBytes } = require("@ethersproject/random");
const { parseBytes32String } = require("@ethersproject/strings");
const hre = require("hardhat");

async function main() {
  const randomBytesArray = randomBytes(32);
  const utf8Encode = new TextEncoder();
  const data = keccak256(utf8Encode.encode("Hello"));
  console.log(data);
  console.log(parseBytes32String(data));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
