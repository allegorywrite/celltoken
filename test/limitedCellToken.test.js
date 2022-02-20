const BN = require("bn.js");
const chai = require("chai");
const { expect } = chai;
const { ethers } = require("hardhat");
chai.use(require("chai-bn")(BN));

describe("TakaiSushiLimitedMembership", function () {
  let cellTokenFactory; // デプロイ用のデータ
  let cellToken; // デプロイした実際のコントラクトアドレス
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let addr4;
  let addrs;

  beforeEach(async function () {
    cellTokenFactory = await ethers.getContractFactory(
      "LimitedCellToken"
    );
    [owner, addr1, addr2, addr3, addr4, ...addrs] = await ethers.getSigners();

    cellToken = await cellTokenFactory.deploy();
  });

  describe("mint", function () {
    // 途中略...
    // コントラクトをデプロイした人は無制限に招待できることを確認
    it("owner is infinity invite", async function () {
      const mintTx = await cellToken.mintAndTransfer(addr1.address);
      mintTx.wait();
      const mintTx1 = await cellToken.mintAndTransfer(addr2.address);
      mintTx1.wait();
      const mintTx2 = await cellToken.mintAndTransfer(addr3.address);
      mintTx2.wait();
      const mintTx3 = await cellToken.mintAndTransfer(addr4.address);
      mintTx3.wait();
      expect(await cellToken.getTotalSupply()).to.be.equal(4);
    });
    // 会員は最大２回まで招待できる
    it("member invite limit", async function () {
      const mintTx = await cellToken.mintAndTransfer(addr1.address);
      mintTx.wait();
      const mintTx1 = await cellToken
        .connect(addr1)
        .mintAndTransfer(addr2.address);
      mintTx1.wait();
      const mintTx2 = await cellToken
        .connect(addr1)
        .mintAndTransfer(addr3.address);
      mintTx2.wait();
      await expect(
        cellToken.connect(addr1).mintAndTransfer(addr4.address)
      ).to.be.revertedWith("cannot invite");
      expect(await cellToken.getTotalSupply()).to.be.equal(3);
    });

    // 重複招待は拒否される
    it("additional test1", async() => {
      const mintTx = await cellToken.mintAndTransfer(addr1.address);
      mintTx.wait();
      const mintTx1 = await cellToken.mintAndTransfer(addr2.address);
      mintTx1.wait();
      await expect(
        cellToken.connect(addr1).mintAndTransfer(addr2.address)
        ).to.be.revertedWith("cannot invite");
      
    });
    // オーナーが何回mintした後でも会員の最大mint数は2
    it("additional test2", async() => {
      const mintTx = await cellToken.mintAndTransfer(addr1.address);
      mintTx.wait();
      const mintTx1 = await cellToken.mintAndTransfer(addr2.address);
      mintTx1.wait();
      const mintTx2 = await cellToken
        .connect(addr1)
        .mintAndTransfer(addr3.address);
      mintTx2.wait();
      const mintTx3 = await cellToken
        .connect(addr1)
        .mintAndTransfer(addr4.address);
      mintTx3.wait();
      await expect(
        cellToken.connect(addr1).mintAndTransfer(addr4.address)
        ).to.be.revertedWith("cannot invite");
    });

    //招待の階層を計算
    it("additional test3", async() => {
      const mintTx = await cellToken.mintAndTransfer(addr1.address);
      mintTx.wait();
      const mintTx1 = await cellToken
        .connect(addr1)
        .mintAndTransfer(addr2.address);
      mintTx1.wait();
      const mintTx2 = await cellToken
        .connect(addr2)
        .mintAndTransfer(addr3.address);
      mintTx2.wait();
      await expect(
        await cellToken.getRankCount(addr3.address)).to.equal(3);
    });
  });
});