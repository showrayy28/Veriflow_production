const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VeriFlowCarbonNFT Smart Contract", function () {
  let contract;
  let admin;
  let farmer;
  let buyer;
  let randomUser;

  const sampleCarbonKg = 664250; // 664.25 tCO2e
  const samplePriceWei = ethers.parseEther("0.25"); // 0.25 MATIC
  const sampleCoords = "21.949700,89.183300";
  const sampleUri = "ipfs://bafkreiaw56g7s57jln7gqpxmty3u2uwr3f45u7c7y6j6w345v6j5q6v3y4";

  beforeEach(async function () {
    [admin, farmer, buyer, randomUser] = await ethers.getSigners();

    const VeriFlowCarbonNFT = await ethers.getContractFactory("VeriFlowCarbonNFT");
    contract = await VeriFlowCarbonNFT.deploy(admin.address);
    await contract.waitForDeployment();
  });

  describe("Deployment & Configuration", function () {
    it("Should set the correct token name, symbol, and initial owner", async function () {
      expect(await contract.name()).to.equal("VeriFlow Blue Carbon Credit");
      expect(await contract.symbol()).to.equal("VF-CARB");
      expect(await contract.owner()).to.equal(admin.address);
    });
  });

  describe("Credit Minting into Escrow", function () {
    it("Should allow admin to mint credit into contract escrow", async function () {
      const tx = await contract.connect(admin).mintCarbonCredit(
        farmer.address,
        sampleCarbonKg,
        samplePriceWei,
        sampleCoords,
        sampleUri
      );

      const contractAddress = await contract.getAddress();
      const tokenId = 101;

      // Contract itself should be the owner of the NFT in escrow
      expect(await contract.ownerOf(tokenId)).to.equal(contractAddress);
      expect(await contract.tokenURI(tokenId)).to.equal(sampleUri);

      // Verify credit struct details
      const credit = await contract.getCredit(tokenId);
      expect(credit.tokenId).to.equal(tokenId);
      expect(credit.farmer).to.equal(farmer.address);
      expect(credit.carbonKg).to.equal(sampleCarbonKg);
      expect(credit.priceWei).to.equal(samplePriceWei);
      expect(credit.coordinates).to.equal(sampleCoords);
      expect(credit.isForSale).to.be.true;
      expect(credit.isRetired).to.be.false;

      // Expect CreditMinted event
      await expect(tx)
        .to.emit(contract, "CreditMinted")
        .withArgs(tokenId, farmer.address, sampleCarbonKg, samplePriceWei, sampleCoords, sampleUri);
    });

    it("Should revert if non-admin attempts to mint", async function () {
      await expect(
        contract.connect(farmer).mintCarbonCredit(
          farmer.address,
          sampleCarbonKg,
          samplePriceWei,
          sampleCoords,
          sampleUri
        )
      ).to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount");
    });
  });

  describe("Marketplace Purchase & Farmer Settlement", function () {
    const tokenId = 101;

    beforeEach(async function () {
      await contract.connect(admin).mintCarbonCredit(
        farmer.address,
        sampleCarbonKg,
        samplePriceWei,
        sampleCoords,
        sampleUri
      );
    });

    it("Should atomically transfer NFT to buyer and MATIC payment to farmer", async function () {
      const farmerInitialBal = await ethers.provider.getBalance(farmer.address);

      // Buyer purchases credit with exact MATIC value
      const tx = await contract.connect(buyer).purchaseCredit(tokenId, {
        value: samplePriceWei,
      });

      // NFT ownership transferred to buyer
      expect(await contract.ownerOf(tokenId)).to.equal(buyer.address);

      // Farmer received full price payment
      const farmerNewBal = await ethers.provider.getBalance(farmer.address);
      expect(farmerNewBal - farmerInitialBal).to.equal(samplePriceWei);

      // Credit state updated to not for sale
      const credit = await contract.getCredit(tokenId);
      expect(credit.isForSale).to.be.false;

      // Expect CreditPurchased event
      await expect(tx)
        .to.emit(contract, "CreditPurchased")
        .withArgs(tokenId, buyer.address, farmer.address, samplePriceWei);
    });

    it("Should refund excess payment sent by buyer", async function () {
      const buyerInitialBal = await ethers.provider.getBalance(buyer.address);
      const overpayment = ethers.parseEther("0.50"); // Sent 0.50 for a 0.25 credit

      const tx = await contract.connect(buyer).purchaseCredit(tokenId, {
        value: overpayment,
      });
      const receipt = await tx.wait();
      const gasSpent = receipt.gasUsed * receipt.gasPrice;

      const buyerFinalBal = await ethers.provider.getBalance(buyer.address);

      // Buyer balance reduced only by samplePriceWei + gasSpent (excess was refunded)
      expect(buyerInitialBal - buyerFinalBal - gasSpent).to.equal(samplePriceWei);
    });

    it("Should revert if buyer sends insufficient MATIC", async function () {
      const lowPayment = ethers.parseEther("0.10");
      await expect(
        contract.connect(buyer).purchaseCredit(tokenId, { value: lowPayment })
      ).to.be.revertedWith("Insufficient MATIC sent for purchase");
    });
  });

  describe("ESG Retirement Flow", function () {
    const tokenId = 101;

    beforeEach(async function () {
      await contract.connect(admin).mintCarbonCredit(
        farmer.address,
        sampleCarbonKg,
        samplePriceWei,
        sampleCoords,
        sampleUri
      );
      await contract.connect(buyer).purchaseCredit(tokenId, { value: samplePriceWei });
    });

    it("Should allow NFT owner to retire credit for ESG compliance", async function () {
      const reason = "GreenFuture 2026 Net Zero Carbon Offset Commitment";
      const tx = await contract.connect(buyer).retireCredit(tokenId, reason);

      const credit = await contract.getCredit(tokenId);
      expect(credit.isRetired).to.be.true;
      expect(credit.isForSale).to.be.false;
      expect(credit.retiredAt).to.be.greaterThan(0);

      // NFT stays with owner as proof of retirement
      expect(await contract.ownerOf(tokenId)).to.equal(buyer.address);

      await expect(tx)
        .to.emit(contract, "CreditRetired")
        .withArgs(tokenId, buyer.address, reason);
    });

    it("Should revert if non-owner attempts to retire credit", async function () {
      await expect(
        contract.connect(randomUser).retireCredit(tokenId, "Unauthorized retirement")
      ).to.be.revertedWith("Only current NFT owner can retire this credit");
    });
  });
});
