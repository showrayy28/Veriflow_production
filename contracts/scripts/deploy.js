const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("\n🚀 Starting VeriFlow Blue Carbon NFT Smart Contract Deployment...");

  const [deployer] = await hre.ethers.getSigners();
  console.log(`👤 Deployer Account: ${deployer.address}`);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`💰 Account Balance: ${hre.ethers.formatEther(balance)} MATIC\n`);

  // Deploy VeriFlowCarbonNFT with deployer as initialOwner
  const VeriFlowCarbonNFT = await hre.ethers.getContractFactory("VeriFlowCarbonNFT");
  const contract = await VeriFlowCarbonNFT.deploy(deployer.address);
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log(`✅ VeriFlowCarbonNFT successfully deployed!`);
  console.log(`📍 Contract Address: ${contractAddress}`);
  console.log(`🔗 PolygonScan Amoy: https://amoy.polygonscan.com/address/${contractAddress}\n`);

  // Export Contract Deployment Info and ABI for Client
  const deploymentInfo = {
    contractAddress,
    network: hre.network.name,
    chainId: hre.network.config.chainId || 80002,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
  };

  const clientConfigDir = path.join(__dirname, "../../client/src/config");
  if (!fs.existsSync(clientConfigDir)) {
    fs.mkdirSync(clientConfigDir, { recursive: true });
  }

  // Read compiled artifact for ABI
  const artifactPath = path.join(__dirname, "../artifacts/VeriFlowCarbonNFT.sol/VeriFlowCarbonNFT.json");
  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    
    // Save ABI and Address to client/src/config/contractConfig.json
    fs.writeFileSync(
      path.join(clientConfigDir, "contractConfig.json"),
      JSON.stringify(
        {
          ...deploymentInfo,
          abi: artifact.abi,
        },
        null,
        2
      )
    );
    console.log(`📄 Exported ABI and address to client/src/config/contractConfig.json`);
  }

  console.log("🎉 Deployment complete!\n");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
