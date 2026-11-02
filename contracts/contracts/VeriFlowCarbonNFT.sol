// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title VeriFlowCarbonNFT
 * @notice Blue Carbon MRV Registry & Web3 Carbon Credit Marketplace on Polygon Amoy
 * @dev Implements ERC-721 tokenization of verified mangrove blue carbon plots with built-in
 *      contract escrow, direct MATIC payment routing to coastal farmers, and immutable ESG retirement.
 */
contract VeriFlowCarbonNFT is ERC721URIStorage, Ownable, ReentrancyGuard, IERC721Receiver {
    uint256 private _nextTokenId;

    struct CarbonCredit {
        uint256 tokenId;
        address payable farmer;
        uint256 carbonKg;
        uint256 priceWei;
        string coordinates;
        bool isForSale;
        bool isRetired;
        string tokenURI;
        uint256 mintedAt;
        uint256 retiredAt;
    }

    // Mapping from Token ID to CarbonCredit details
    mapping(uint256 => CarbonCredit) public credits;
    
    // Array to track all minted token IDs for marketplace enumeration
    uint256[] private _allTokenIds;

    // Events
    event CreditMinted(
        uint256 indexed tokenId,
        address indexed farmer,
        uint256 carbonKg,
        uint256 priceWei,
        string coordinates,
        string tokenURI
    );

    event CreditPurchased(
        uint256 indexed tokenId,
        address indexed buyer,
        address indexed farmer,
        uint256 priceWei
    );

    event CreditRetired(
        uint256 indexed tokenId,
        address indexed owner,
        string reason
    );

    event PriceUpdated(
        uint256 indexed tokenId,
        uint256 oldPriceWei,
        uint256 newPriceWei
    );

    constructor(address initialOwner) 
        ERC721("VeriFlow Blue Carbon Credit", "VF-CARB") 
        Ownable(initialOwner) 
    {
        _nextTokenId = 100; // Start token IDs from 101 for readability
    }

    /**
     * @notice Mints a new Blue Carbon Credit NFT directly into contract escrow.
     * @dev Only callable by the MRV Lead Auditor (Contract Owner).
     * @param farmer The coastal farmer wallet address who restored the mangrove plot.
     * @param carbonKg Total verified sequestered carbon weight in kilograms.
     * @param priceWei Marketplace listing price in Wei (MATIC).
     * @param coords GPS coordinates formatted as "latitude,longitude".
     * @param uri IPFS metadata URI containing telemetry proofs.
     * @return tokenId The newly minted token ID.
     */
    function mintCarbonCredit(
        address payable farmer,
        uint256 carbonKg,
        uint256 priceWei,
        string memory coords,
        string memory uri
    ) external onlyOwner returns (uint256) {
        require(farmer != address(0), "Invalid farmer address");
        require(carbonKg > 0, "Carbon weight must be greater than zero");
        require(priceWei > 0, "Price must be greater than zero");
        require(bytes(uri).length > 0, "Token URI cannot be empty");

        _nextTokenId++;
        uint256 tokenId = _nextTokenId;

        // Mint token directly to this contract as escrow custodian
        _safeMint(address(this), tokenId);
        _setTokenURI(tokenId, uri);

        credits[tokenId] = CarbonCredit({
            tokenId: tokenId,
            farmer: farmer,
            carbonKg: carbonKg,
            priceWei: priceWei,
            coordinates: coords,
            isForSale: true,
            isRetired: false,
            tokenURI: uri,
            mintedAt: block.timestamp,
            retiredAt: 0
        });

        _allTokenIds.push(tokenId);

        emit CreditMinted(tokenId, farmer, carbonKg, priceWei, coords, uri);

        return tokenId;
    }

    /**
     * @notice Purchases a verified Blue Carbon Credit from contract escrow.
     * @dev Atomically transfers the NFT to buyer and forwards the full MATIC payment to the farmer.
     * @param tokenId The ID of the credit to purchase.
     */
    function purchaseCredit(uint256 tokenId) external payable nonReentrant {
        CarbonCredit storage credit = credits[tokenId];

        require(credit.tokenId == tokenId && credit.farmer != address(0), "Credit does not exist");
        require(credit.isForSale, "Credit is not listed for sale");
        require(!credit.isRetired, "Cannot purchase a retired credit");
        require(msg.value >= credit.priceWei, "Insufficient MATIC sent for purchase");

        // Update listing state
        credit.isForSale = false;

        // Forward payment directly to the coastal farmer
        (bool success, ) = credit.farmer.call{value: credit.priceWei}("");
        require(success, "Payment transfer to farmer failed");

        // Refund any excess MATIC sent by buyer
        uint256 excess = msg.value - credit.priceWei;
        if (excess > 0) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: excess}("");
            require(refundSuccess, "Refund of excess MATIC failed");
        }

        // Transfer NFT from contract escrow to buyer
        _transfer(address(this), msg.sender, tokenId);

        emit CreditPurchased(tokenId, msg.sender, credit.farmer, credit.priceWei);
    }

    /**
     * @notice Retires a Blue Carbon Credit permanently for corporate ESG offset compliance.
     * @dev Token remains with owner but is permanently locked as retired on-chain.
     * @param tokenId The ID of the credit to retire.
     * @param reason ESG commitment or beneficiary reference statement.
     */
    function retireCredit(uint256 tokenId, string memory reason) external {
        require(ownerOf(tokenId) == msg.sender, "Only current NFT owner can retire this credit");
        CarbonCredit storage credit = credits[tokenId];
        require(!credit.isRetired, "Credit is already retired");

        credit.isRetired = true;
        credit.isForSale = false;
        credit.retiredAt = block.timestamp;

        emit CreditRetired(tokenId, msg.sender, reason);
    }

    /**
     * @notice Updates the listing price of a credit before it is sold.
     */
    function updatePrice(uint256 tokenId, uint256 newPriceWei) external {
        CarbonCredit storage credit = credits[tokenId];
        require(credit.tokenId == tokenId, "Credit does not exist");
        require(credit.isForSale, "Credit is not for sale");
        require(
            msg.sender == owner() || msg.sender == credit.farmer || ownerOf(tokenId) == msg.sender,
            "Unauthorized to update price"
        );
        require(newPriceWei > 0, "Price must be greater than zero");

        uint256 oldPrice = credit.priceWei;
        credit.priceWei = newPriceWei;

        emit PriceUpdated(tokenId, oldPrice, newPriceWei);
    }

    /**
     * @notice Returns total number of minted credits.
     */
    function totalCredits() external view returns (uint256) {
        return _allTokenIds.length;
    }

    /**
     * @notice Returns details of a specific credit.
     */
    function getCredit(uint256 tokenId) external view returns (CarbonCredit memory) {
        require(credits[tokenId].farmer != address(0), "Credit does not exist");
        return credits[tokenId];
    }

    /**
     * @notice Returns all credits for easy marketplace enumeration.
     */
    function getAllCredits() external view returns (CarbonCredit[] memory) {
        uint256 total = _allTokenIds.length;
        CarbonCredit[] memory all = new CarbonCredit[](total);
        for (uint256 i = 0; i < total; i++) {
            all[i] = credits[_allTokenIds[i]];
        }
        return all;
    }

    /**
     * @notice Handles receipt of ERC-721 token in contract escrow.
     */
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
