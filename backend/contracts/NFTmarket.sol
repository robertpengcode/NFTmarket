// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTmarket is Ownable, ReentrancyGuard {

    struct Listing {
        address seller;
        uint256 price;
    }

    uint8 public immutable marketFeePercent;
    //sellers to their proceeds
    mapping(address => uint256) private sellersProceeds;
    //nft contract address to token id to listing
    mapping(address => mapping(uint256 => Listing)) private listings;

    event MarketOwnerWithdrew(address indexed owner, uint256 amount, uint256 time);
    event SellerWithdrew(address indexed seller, uint256 amount, uint256 time);
    event ListedNFT(address nftContractAddr, uint256 tokenId, address indexed seller, uint256 price, uint256 time);
    event UpdatedListingPrice(address nftContractAddr, uint256 tokenId, uint256 newPrice, uint256 time);
    event DeletedListing(address nftContractAddr, uint256 tokenId, uint256 time);
    event BoughtNFT(address nftContractAddr, uint256 tokenId, address buyer, address seller, uint256 price, uint256 time);

    error NFTmarket__NotNftOwner();
    error NFTmarket__NotApprovedBySeller();
    error NFTmarket__PriceNotValid();
    error NFTmarket__AlreadyListed();
    error NFTmarket__NotListed();
    error NFTmarket__SentWrongValue();
    error NFTmarket__SentOwnerFailed();
    error NFTmarket__SentSellerFailed();
    error NFTmarket__NoBalance();

    modifier ownedBySeller(address nftContractAddr, uint256 tokenId) {
       address nftOwner = IERC721(nftContractAddr).ownerOf(tokenId);
       if (nftOwner != msg.sender) {
        revert NFTmarket__NotNftOwner();
       }
        _;
    }

    modifier notListed(address nftContractAddr, uint256 tokenId) {
        if (listings[nftContractAddr][tokenId].price > 0) {
            revert NFTmarket__AlreadyListed();
        }
        _;
    }

    modifier isListed(address nftContractAddr, uint256 tokenId) {
        if (listings[nftContractAddr][tokenId].price <= 0) {
            revert NFTmarket__NotListed();
        }
        _;
    }

    constructor(uint8 _marketFeePercent) {
        marketFeePercent = _marketFeePercent;
    }

    function listNFT(address nftContractAddr, uint256 tokenId, uint256 price) external ownedBySeller(nftContractAddr, tokenId) notListed(nftContractAddr, tokenId) {
        if (price <= 0) {
            revert NFTmarket__PriceNotValid();
        }
        if (IERC721(nftContractAddr).getApproved(tokenId) != address(this)) {
            revert NFTmarket__NotApprovedBySeller();
        }
        listings[nftContractAddr][tokenId].seller = msg.sender;
        listings[nftContractAddr][tokenId].price = price;
        // or
        //listings[nftContractAddr][tokenId] = Listing(msg.sender, price);
        emit ListedNFT(nftContractAddr, tokenId, msg.sender, price, block.timestamp);
    }

    function buyNFT(address nftContractAddr, uint256 tokenId) external payable isListed(nftContractAddr, tokenId) nonReentrant{
        Listing memory listing = listings[nftContractAddr][tokenId];
        address seller = listing.seller;
        uint256 price = listing.price;
        if (price != msg.value) {
            revert NFTmarket__SentWrongValue();
        }
        uint256 marketFee = (price * marketFeePercent) / 100;
        uint256 sellerProceed = price - marketFee;
        delete listings[nftContractAddr][tokenId];
        sellersProceeds[seller] += sellerProceed;
        IERC721(nftContractAddr).safeTransferFrom(seller, msg.sender, tokenId);
        emit BoughtNFT(nftContractAddr, tokenId, msg.sender, seller, price, block.timestamp);
    }

    function updateListingPrice(address nftContractAddr, uint256 tokenId, uint256 newPrice) external isListed(nftContractAddr, tokenId){
        if (newPrice <= 0) {
            revert NFTmarket__PriceNotValid();
        }
        listings[nftContractAddr][tokenId].price = newPrice;
        emit UpdatedListingPrice(nftContractAddr, tokenId, newPrice, block.timestamp);
    }

    function deleteListing(address nftContractAddr, uint256 tokenId) external isListed(nftContractAddr, tokenId) {
        delete listings[nftContractAddr][tokenId];
        emit DeletedListing(nftContractAddr, tokenId, block.timestamp);
    }

    function sellerWithdraw() external nonReentrant {
        uint256 sellerBalance = sellersProceeds[msg.sender];
        if (sellerBalance <= 0) revert NFTmarket__NoBalance();
        sellersProceeds[msg.sender] = 0;
        (bool sentSeller,) = payable(msg.sender).call{value: sellerBalance}("");
        if (!sentSeller) {
            revert NFTmarket__SentSellerFailed();
        }
        emit SellerWithdrew(msg.sender, sellerBalance, block.timestamp);
    }

    function marketOwnerWithdraw() external onlyOwner {
        uint256 ownerBalance = address(this).balance;
         if (ownerBalance <= 0) revert NFTmarket__NoBalance();
        (bool sentOwner,) = payable(msg.sender).call{value: ownerBalance}("");
        if (!sentOwner) {
            revert NFTmarket__SentOwnerFailed();
        }
        emit MarketOwnerWithdrew(msg.sender, ownerBalance, block.timestamp);
    }

    function getListing(address nftContractAddr, uint256 tokenId) external view returns(address, uint256){
        Listing memory listing = listings[nftContractAddr][tokenId];
        return (listing.seller, listing.price);
    }

    function getSellerProceed(address seller) external view returns (uint256) {
        return sellersProceeds[seller];
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

}
