// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Bloom = await hre.ethers.getContractFactory("contracts/Bloom.sol:Bloom");

  const treasurer = "0xE21596Fbb266EA507B17b56682FBEE0ab8260cA6";
  const fee = ethers.utils.parseEther("1");
  const uri = "https://tokens.fstvl.io/bloom-season-{id}.json";
  const name = "Bloom by Festival Labs";
  const symbol = "BLOOM";

  const bloom1155 = await Bloom.deploy(treasurer, fee, uri, name, symbol);

  await bloom1155.deployed();

  console.log("Bloom deployed to:", bloom1155.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
