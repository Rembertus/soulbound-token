import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { SoulBoundToken } from "../typechain-types/contracts/SoulBoundToken";

describe("SoulBoundToken Contract", function () {
  let sbtContract: SoulBoundToken;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;

  async function deploySBTFixture() {
    const SbtFactory = await ethers.getContractFactory("SoulBoundToken");
    const sbt = (await SbtFactory.deploy()) as SoulBoundToken;
    const deploymentTransaction = sbt.deploymentTransaction();
    if (deploymentTransaction) {
      await deploymentTransaction.wait();
    }

    const [own, addr] = await ethers.getSigners();
    return { sbt, own, addr };
  }

  describe("Deploy Contract", function () {
    it("Should deploy the contract", async function () {
      const { sbt, own, addr } = await loadFixture(deploySBTFixture);
      expect(sbt.getAddress()).not.equal(0);

      sbtContract = sbt;
      owner = own;
      addr1 = addr;
    });
  });

  describe("Mint a Token", function () {
    it("Should mint a new SoulBound Token", async function () {
      const tx = await sbtContract.mint(
        "Juan Perez",
        "Licenciado en Ciencias de la Computacion",
        "c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
        "Universidad Central",
        "Ciencias de la Computacion",
        "Direccion Academica - Universidad Central",
        "Certificado de Egreso",
        1625097600
      );

      const tokenId = 0; // First token ID
      const tokenData = await sbtContract.getTokenData(tokenId);
      expect(tokenData.name).to.equal("Juan Perez");
      expect(tokenData.description).to.equal("Licenciado en Ciencias de la Computacion");
      expect(tokenData.ipfsHash).to.equal("c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470");
      expect(tokenData.university).to.equal("Universidad Central");
      expect(tokenData.career).to.equal("Ciencias de la Computacion");
      expect(tokenData.certifyingEntity).to.equal("Direccion Academica - Universidad Central");
      expect(tokenData.certificateType).to.equal("Certificado de Egreso");
      expect(tokenData.issueDate).to.equal(1625097600);
    });
  });

  describe("Non-transferability", function () {
    it("Should mint a new SoulBound Token - 2", async function () {
      await sbtContract.mint(
        "Ana Lopez",
        "Maestria en Economia",
        "3f3cf3ad8d9e576185302f1a472c0f875e441b04d55300145b907eda8cb1fe27",
        "Segunda Universidad",
        "Economia",
        "Segunda Universidad",
        "Certificado de Graduado",
        1625097601
      );
    });

    it("Should not allow transfer of SoulBound Tokens using transferFrom", async function () {
      const tokenId = 1; // Second token ID

      await expect(
        sbtContract.transferFrom(owner.address, addr1.address, tokenId)
      ).to.be.revertedWith("SoulBound Token cannot be transferred");
    });

    it("Should not allow transfer of SoulBound Tokens using safeTransferFrom", async function () {
      const tokenId = 1; // Second token ID

      await expect(
        // Overloaded function call
        sbtContract["safeTransferFrom(address,address,uint256,bytes)"](owner.address, addr1.address, tokenId, "0x")
      ).to.be.revertedWith("SoulBound Token cannot be transferred");
    });
  });

  describe("Token Data Retrieval", function () {
    it("Should retrieve the correct token data", async function () {
      await sbtContract.mint(
        "Marco Portoalegre",
        "PhD en Biologia",
        "2610ed2c5459501d57107de27a9f52fd2581f90cf2053dabd4ca35a2434dbf84",
        "Universidad Central",
        "Biologia",
        "Universidad Central",
        "Doctorado",
        1625097602
      );

      const tokenId = 2; // Third token ID
      const tokenData = await sbtContract.getTokenData(tokenId);

      expect(tokenData.name).to.equal("Marco Portoalegre");
      expect(tokenData.description).to.equal("PhD en Biologia");
      expect(tokenData.ipfsHash).to.equal("2610ed2c5459501d57107de27a9f52fd2581f90cf2053dabd4ca35a2434dbf84");
      expect(tokenData.university).to.equal("Universidad Central");
      expect(tokenData.career).to.equal("Biologia");
      expect(tokenData.certifyingEntity).to.equal("Universidad Central");
      expect(tokenData.certificateType).to.equal("Doctorado");
      expect(tokenData.issueDate).to.equal(1625097602);
    });

    it("Should revert if token does not exist", async function () {
      await expect(sbtContract.getTokenData(999)).to.be.revertedWith("Token does not exist");
    });
  });
});
