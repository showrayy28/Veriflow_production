import axios from 'axios';
import { ethers } from 'ethers';

/**
 * ===== BLOCKCHAIN CONFIGURATION =====
 */
const POLYGON_AMOY_CONFIG = {
  chainId: '0x13882',
  chainName: 'Polygon Amoy Testnet',
  rpcUrl: 'https://rpc-amoy.polygon.technology/',
  blockExplorerUrl: 'https://amoy.polygonscan.com/',
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
};

/**
 * ===== PINATA IPFS CONFIGURATION =====
 */
const PINATA_CONFIG = {
  apiKey: '1f1646143541bb405739',
  apiSecret: '8e9de40b169b350f41c000049f9d7807b2e6f99cccbd33f01ba98942890f8ac0',
  jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjN2EzMmJmMi0wMzhhLTRmZTEtOTVmZC00ZjUyNDFmZTU1MGQiLCJlbWFpbCI6InNvdW15YWFwYWwyODAzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIxZjE2NDYxNDM1NDFiYjQwNTczOSIsInNjb3BlZEtleVNlY3JldCI6IjhlOWRlNDBiMTY5YjM1MGY0MWMwMDAwNDlmOWQ3ODA3YjJlNmY5OWNjY2JkMzNmMDFiYTk4OTQyODkwZjhhYzAiLCJleHAiOjE4MDM1NDk1OTB9.k-lWgxG_N7T9_lScv9y1FUbYPQr3Mv8Sj1pvBz7A6wk',
  pinataApiUrl: 'https://api.pinata.cloud',
  pinataGatewayUrl: 'https://gateway.pinata.cloud/ipfs/',
};

/**
 * ===== CARBON CREDIT SMART CONTRACT =====
 */
const CARBON_CREDIT_CONTRACT = {
  address: '0xe848076708FEA2a9f4C03be19E4dDD76a560c8719',
  abi: [
    {
      "inputs": [
        {"internalType": "address", "name": "to", "type": "address"},
        {"internalType": "string", "name": "projectId", "type": "string"},
        {"internalType": "uint256", "name": "carbonAmount", "type": "uint256"},
        {"internalType": "string", "name": "metadataURI", "type": "string"}
      ],
      "name": "mintCarbonCredit",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
      "name": "calculatePrice",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
      "name": "getCarbonCredit",
      "outputs": [
        {"internalType": "string", "name": "projectId", "type": "string"},
        {"internalType": "uint256", "name": "carbonAmount", "type": "uint256"},
        {"internalType": "uint256", "name": "mintedAt", "type": "uint256"},
        {"internalType": "address", "name": "originalOwner", "type": "address"},
        {"internalType": "bool", "name": "isActive", "type": "bool"}
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
      "name": "tokensOfOwner",
      "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
      "name": "tokenURI",
      "outputs": [{"internalType": "string", "name": "", "type": "string"}],
      "stateMutability": "view",
      "type": "function"
    }
  ],
};

// ✅ FIXED: This was defined but never exported before
const CARBON_CREDIT_PRICING = {
  pricePerTonUSD: 50,
  pricePerTonMATIC: 0.02,
};

/**
 * ===== UTILITY FUNCTIONS =====
 */
const kgToTons = (kg) => kg / 1000;
const kgToWei = (kg) => ethers.utils.parseUnits(kg.toString(), 18);
const weiToKg = (wei) => parseFloat(ethers.utils.formatUnits(wei, 18));

// ✅ FIXED: This was defined but never exported before
const calculateCarbonCreditPrice = (carbonKg) =>
  kgToTons(carbonKg) * CARBON_CREDIT_PRICING.pricePerTonMATIC;

/**
 * ===== IPFS / PINATA FUNCTIONS =====
 */
const uploadMetadataToPinata = async (metadata) => {
  try {
    const response = await axios.post(
      `${PINATA_CONFIG.pinataApiUrl}/pinning/pinJSONToIPFS`,
      {
        pinataContent: metadata,
        pinataMetadata: { name: `Carbon-Credit-${metadata.projectDetails?.id || 'new'}` },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${PINATA_CONFIG.jwt}`,
        },
      }
    );
    return response.data.IpfsHash;
  } catch (error) {
    console.error('Pinata Upload Error:', error);
    throw new Error('Failed to upload metadata to IPFS');
  }
};

const uploadImageToPinata = async (imageUri, fileName) => {
  try {
    const formData = new FormData();
    formData.append('file', { uri: imageUri, type: 'image/jpeg', name: fileName || 'image.jpg' });
    formData.append('pinataMetadata', JSON.stringify({ name: fileName || 'image.jpg' }));

    const response = await axios.post(
      `${PINATA_CONFIG.pinataApiUrl}/pinning/pinFileToIPFS`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${PINATA_CONFIG.jwt}`,
        },
      }
    );
    return response.data.IpfsHash;
  } catch (error) {
    console.error('Pinata Image Error:', error);
    throw new Error('Failed to upload image to IPFS');
  }
};

/**
 * ===== BLOCKCHAIN INTERACTION FUNCTIONS =====
 */
const mintCarbonCreditNFT = async (project, mlResults, walletAddress, imageUri = null) => {
  try {
    let imageIpfsHash = null;
    if (imageUri) imageIpfsHash = await uploadImageToPinata(imageUri, `${project._id}-image.jpg`);

    const carbonKg = mlResults.final_results?.carbon_sequestration_kg || 0;

    const metadata = {
      name: `Veriflow Carbon Credit #${project._id.slice(-6)}`,
      description: `Verified ${kgToTons(carbonKg).toFixed(2)} tons of CO2 sequestered.`,
      image: imageIpfsHash
        ? `${PINATA_CONFIG.pinataGatewayUrl}${imageIpfsHash}`
        : 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
      attributes: [
        { trait_type: 'Project ID', value: project._id },
        { trait_type: 'Carbon (kg)', value: carbonKg, display_type: 'number' },
      ],
    };

    const metadataIpfsHash = await uploadMetadataToPinata(metadata);
    const metadataURI = `${PINATA_CONFIG.pinataGatewayUrl}${metadataIpfsHash}`;

    return {
      success: true,
      metadataURI,
      projectId: project._id,
      carbonAmount: kgToWei(carbonKg).toString(),
      price: calculateCarbonCreditPrice(carbonKg),
      contractAddress: CARBON_CREDIT_CONTRACT.address,
      walletAddress,
    };
  } catch (error) {
    console.error('Minting Prep Error:', error);
    throw error;
  }
};

const fetchUserNFTs = async (walletAddress) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(POLYGON_AMOY_CONFIG.rpcUrl);
    const contract = new ethers.Contract(
      CARBON_CREDIT_CONTRACT.address,
      CARBON_CREDIT_CONTRACT.abi,
      provider
    );

    const tokenIds = await contract.tokensOfOwner(walletAddress);

    let userNFTs = [];
    for (let id of tokenIds) {
      const tokenURI = await contract.tokenURI(id);
      const creditData = await contract.getCarbonCredit(id);

      userNFTs.push({
        tokenId: id.toString(),
        projectId: creditData.projectId,
        carbonKg: weiToKg(creditData.carbonAmount),
        metadataUrl: tokenURI,
      });
    }
    return userNFTs;
  } catch (error) {
    console.error('Error fetching NFTs from blockchain:', error);
    return [];
  }
};

// ✅ FIXED: Added all missing exports — CARBON_CREDIT_PRICING, kgToTons, calculateCarbonCreditPrice
export default {
  POLYGON_AMOY_CONFIG,
  CARBON_CREDIT_CONTRACT,
  CARBON_CREDIT_PRICING,        // ← was missing
  kgToTons,                     // ← was missing
  kgToWei,
  weiToKg,                      // ← was missing
  calculateCarbonCreditPrice,   // ← was missing
  uploadMetadataToPinata,
  uploadImageToPinata,          // ← was missing
  mintCarbonCreditNFT,
  fetchUserNFTs,
};