import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, keccak256, Wallet } from "ethers";

const abiSoulBoundToken = require("../artifacts/contracts/SoulBoundToken.sol/SoulBoundToken.json");

describe("SBT Contract DEPLOYED", function () {
  let sbtContract: Contract;
  let wallet: Wallet;
  let addr1: Wallet;

  const abi = new ethers.AbiCoder()

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const privateKeyOwner = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const privateKeyAddr1 = "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e";

  let tokenId = 0;

  function findEventArgs(logs: any, eventName: any) {
    let _event = null;
    for (const event of logs) {
      if (event.fragment && event.fragment.name === eventName) {
        _event = event.args;
      }
    }
    return _event;
  }

  async function getDataContract() {
    const httpProvider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

    wallet = new ethers.Wallet(privateKeyOwner, httpProvider);
    addr1 = new ethers.Wallet(privateKeyAddr1, httpProvider);
    const sbt = new ethers.Contract(contractAddress, abiSoulBoundToken.abi, wallet);

    return { sbt };
  }

  it("Should get the contract deployed", async function () {
    const { sbt } = await getDataContract();
    expect(sbt.getAddress()).not.equal(0);

    sbtContract = sbt;
  });

  describe("Mint a Token", function () {
    it("Should mint a new SoulBound Token", async function () {
      const name: string = "Juan Perez";
      const description: string = "Licenciado en Ciencias de la Computacion";
      const ipfsHash: string = "c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470";
      const university: string = "Universidad Central";
      const career: string = "Ciencias de la Computacion";
      const certifyingEntity: string = "Direccion Academica - Universidad Central";
      const certificateType: string = "Certificado de Egreso";
      const issueDate: number = 1625097600;

      let hash0 = keccak256(abi.encode(["bytes1"], ["0x19"]));
      let hash = keccak256(abi.encode(["bytes32", "string", "string", "string", "string", "string", "string", "string", "uint256"],
        [hash0, name, description, ipfsHash, university, career, certifyingEntity, certificateType, issueDate]));

      const nonce = await wallet.getNonce();
      const tx = await sbtContract.connect(wallet)["mint(string, string, string, string, string, string, string, uint256)"]
        (name, description, ipfsHash, university, career, certifyingEntity, certificateType, issueDate,
          { nonce: nonce }
        );

      const receipt = await tx.wait();
      await new Promise((res) => setTimeout(() => res(null), 2000));
      const events = findEventArgs(receipt?.logs, "MintEvent");
      tokenId = events[0];
      expect(events[1]).to.equal(hash);
    });
  });

  describe("Get Token Data", function () {
    it("Should get token data", async function () {
      const nonce = await wallet.getNonce();
      const tokenData = await sbtContract.connect(wallet)["getTokenData(uint256)"](tokenId, { nonce: nonce });

      expect(tokenData[0]).to.equal("Juan Perez");
      expect(tokenData[1]).to.equal("Licenciado en Ciencias de la Computacion");
      expect(tokenData[2]).to.equal("c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470");
      expect(tokenData[3]).to.equal("Universidad Central");
      expect(tokenData[4]).to.equal("Ciencias de la Computacion");
      expect(tokenData[5]).to.equal("Direccion Academica - Universidad Central");
      expect(tokenData[6]).to.equal("Certificado de Egreso");
      expect(tokenData[7]).to.equal(1625097600);
    });
  });

  describe("Non-transferability", function () {
    it("Should not transfer the token", async function () {
      const nonce = await wallet.getNonce();
      await expect(
        // Overloaded function call
        sbtContract.connect(wallet)["safeTransferFrom(address,address,uint256,bytes)"](wallet.address, addr1.address, tokenId, "0x", { nonce: nonce })
      ).to.be.revertedWith("SoulBound Token cannot be transferred");
    });
  });
});
