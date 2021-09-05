const { BigNumber } = require("@ethersproject/bignumber");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token", function () {
  let token;
  const name = "Val's token";
  const symbol = "VT";
  beforeEach(async () => {
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy(name, symbol);
  });
  it("Deploy with name and symbol given in constructor", async function () {
    await token.deployed();
    expect(await token.name()).to.equal(name);
    expect(await token.symbol()).to.equal(symbol);
  });
  it("Give deployer the total supply", async function() {
    await token.deployed();
    const [owner] = await ethers.getSigners();
    // console.log(owner.address, alex.address, beth.address);
    const totalSupply = await token.totalSupply();
    // console.log("owner", owner.address);
    // console.log("totalSupply", totalSupply, totalSupply.toString());
    expect(await token.balances(owner.address)).to.equal(totalSupply);
  });
  it("Sets owner to the deployer", async function() {
    await token.deployed();
    const [deployer] = await ethers.getSigners();
    const owner = await token.owner();
    expect(owner).to.equal(deployer.address);
  });
  describe("transfer", function() {
    it("Should revert if sender does not have sufficient funds", async function() {
      await token.deployed();
      const [deployer, alex, beth] = await ethers.getSigners();
      const from = beth;
      const to = alex.address;
      const amount = BigNumber.from("100");
      try {
        await token.connect(from).transfer(to, amount);
      } catch (error) {
        expect(error.message.includes("Not enough tokens")).to.be.true;
      }
    });
    it("Should successfully decrease sender balance and increase recipient balance", async function() {
      await token.deployed();
      const [deployer, alex] = await ethers.getSigners();

      // Values used in transfer function
      const to = alex.address;
      const amount = BigNumber.from("100");

      const zeroAmount = BigNumber.from("0");

      // Starting supply and balances
      const startingTotalSupply = await token.totalSupply();
      const alexStartingBalance = await token.balances(alex.address);
      const deployerStartingBalance = await token.balances(deployer.address);

      // Execute transfer
      const transferTx = await token.transfer(to, amount);
      await transferTx.wait();

      // Grab new balances
      const deployerBalance = await token.balances(deployer.address);
      // console.log("deployerBalance", deployerBalance.toString());

      expect(startingTotalSupply.eq(deployerStartingBalance)).to.be.true;
      expect(deployerStartingBalance.gt(deployerBalance)).to.be.true;

      const alexBalance = await token.balances(alex.address);
      // console.log("alexBalance", alexBalance.toString());

      expect(zeroAmount.eq(alexStartingBalance)).to.be.true;
      expect(amount.eq(alexBalance)).to.be.true;
    });
  });
});
