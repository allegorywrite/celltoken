const BN = require("bn.js");
const chai = require("chai");
const { expect } = chai;
const { ethers } = require("hardhat");
chai.use(require("chai-bn")(BN));

describe("CellToken test", () => {
  let cellTokenFactory;
  let cellToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    cellTokenFactory = await ethers.getContractFactory(
      "CellToken"
    );
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    cellToken = await cellTokenFactory.deploy();
  });

  describe("mint", () => {
    it("mint owner sucess", async () => {
      const mintTx = await cellToken.mintAndTransfer(addr1.address);
      mintTx.wait();
      expect(await cellToken.ownerOf(1)).to.be.equal(addr1.address);
      const mintTx1 = await cellToken
        .connect(addr1)
        .mintAndTransfer(addr2.address);
      mintTx1.wait();
      expect(await cellToken.ownerOf(2)).to.be.equal(addr2.address);
    });
  });

  describe("total supply", function () {
    it("getTotalSupply", async function () {
      expect(await cellToken.getTotalSupply()).to.be.equal(0);
      const mintTx = await cellToken.mintAndTransfer(addr1.address);
      mintTx.wait();
      expect(await cellToken.getTotalSupply()).to.be.equal(1);
      const mintTx2 = await cellToken.mintAndTransfer(addr2.address);
      mintTx2.wait();
      expect(await cellToken.getTotalSupply()).to.be.equal(2);
    });
  });
});