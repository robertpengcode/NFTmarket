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
    struct Collection {
        address royaltyAddr;
        uint8 royaltyPercent;
        string collectionURI;
    }

    uint8 public marketFeePercent;
    uint256 private marketFeeBalance;
    //sellers and royalty owners to their proceeds
    mapping(address => uint256) private usersProceeds;
    //nft contract address to token id to Listing
    mapping(address => mapping(uint256 => Listing)) private listings;
    //nft contract address to Collection
    mapping(address => Collection) private collections;

    event MarketOwnerWithdrew(
        address indexed owner,
        uint256 amount,
        uint256 time
    );
    event UserWithdrew(address indexed user, uint256 amount, uint256 time);
    event CreatedCollection(
        address indexed nftContractAddr,
        address indexed royaltyAddr,
        uint8 royaltyPercent,
        string collectionURI,
        address indexed marketOwner,
        uint256 time
    );
    event UpdatedCollection(
        address indexed nftContractAddr,
        address indexed royaltyAddr,
        uint8 royaltyPercent,
        string collectionURI,
        address indexed marketOwner,
        uint256 time
    );
    event DeletedCollection(
        address indexed nftContractAddr,
        address indexed marketOwner,
        uint256 time
    );
    event ListedNFT(
        address indexed nftContractAddr,
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price,
        uint256 time
    );
    event UpdatedListingPrice(
        address indexed nftContractAddr,
        uint256 indexed tokenId,
        uint256 newPrice,
        uint256 time
    );
    event DeletedListing(
        address indexed nftContractAddr,
        uint256 indexed tokenId,
        uint256 time
    );
    event BoughtNFT(
        address indexed nftContractAddr,
        uint256 indexed tokenId,
        address indexed buyer,
        address seller,
        uint256 price,
        uint256 time
    );

    error NFTmarket__NotNftOwner();
    error NFTmarket__NotMarketOwnerOrSeller();
    error NFTmarket__NotApprovedBySeller();
    error NFTmarket__PriceNotValid();
    error NFTmarket__CollectionAlreadyCreated();
    error NFTmarket__CollectionNotCreated();
    error NFTmarket__AlreadyListed();
    error NFTmarket__NotListed();
    error NFTmarket__SentWrongValue();
    error NFTmarket__SentOwnerFailed();
    error NFTmarket__SentUserFailed();
    error NFTmarket__NoBalance();
    error NFTmarket__NotEnoughBalance();

    modifier ownedBySeller(address nftContractAddr, uint256 tokenId) {
        address nftOwner = IERC721(nftContractAddr).ownerOf(tokenId);
        if (nftOwner != msg.sender) {
            revert NFTmarket__NotNftOwner();
        }
        _;
    }

    modifier marketOwnerOrSeller(address nftContractAddr, uint256 tokenId) {
        address seller = listings[nftContractAddr][tokenId].seller;
        if (msg.sender != seller && msg.sender != owner()) {
            revert NFTmarket__NotMarketOwnerOrSeller();
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

    modifier notCreated(address nftContractAddr) {
        if (collections[nftContractAddr].royaltyAddr != address(0)) {
            revert NFTmarket__CollectionAlreadyCreated();
        }
        _;
    }

    modifier isCreated(address nftContractAddr) {
        if (collections[nftContractAddr].royaltyAddr == address(0)) {
            revert NFTmarket__CollectionNotCreated();
        }
        _;
    }

    constructor(uint8 _marketFeePercent) {
        marketFeePercent = _marketFeePercent;
    }

    function updateMarketFee(uint8 _marketFeePercent) external onlyOwner {
        marketFeePercent = _marketFeePercent;
    }

    //temporarily coded the function to the market owner
    function createCollection(
        address _nftContractAddr,
        address _royaltyAddr,
        uint8 _royaltyPercent,
        string calldata _collectionURI
    ) external onlyOwner notCreated(_nftContractAddr) {
        collections[_nftContractAddr].royaltyAddr = _royaltyAddr;
        collections[_nftContractAddr].royaltyPercent = _royaltyPercent;
        collections[_nftContractAddr].collectionURI = _collectionURI;
        emit CreatedCollection(
            _nftContractAddr,
            _royaltyAddr,
            _royaltyPercent,
            _collectionURI,
            msg.sender,
            block.timestamp
        );
    }

    //temporarily coded the function to the market owner
    function updateCollection(
        address _nftContractAddr,
        address _royaltyAddr,
        uint8 _royaltyPercent,
        string calldata _collectionURI
    ) external onlyOwner isCreated(_nftContractAddr) {
        collections[_nftContractAddr].royaltyAddr = _royaltyAddr;
        collections[_nftContractAddr].royaltyPercent = _royaltyPercent;
        collections[_nftContractAddr].collectionURI = _collectionURI;
        emit UpdatedCollection(
            _nftContractAddr,
            _royaltyAddr,
            _royaltyPercent,
            _collectionURI,
            msg.sender,
            block.timestamp
        );
    }

    //temporarily coded the function to the market owner
    function deleteCollection(
        address _nftContractAddr
    ) external onlyOwner isCreated(_nftContractAddr) {
        delete collections[_nftContractAddr];
        emit DeletedCollection(_nftContractAddr, msg.sender, block.timestamp);
    }

    //seller must own the NFT; only seller can list his/her NFT
    function listNFT(
        address nftContractAddr,
        uint256 tokenId,
        uint256 price
    )
        external
        ownedBySeller(nftContractAddr, tokenId)
        notListed(nftContractAddr, tokenId)
    {
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
        emit ListedNFT(
            nftContractAddr,
            tokenId,
            msg.sender,
            price,
            block.timestamp
        );
    }

    function buyNFT(
        address nftContractAddr,
        uint256 tokenId
    ) external payable isListed(nftContractAddr, tokenId) nonReentrant {
        Listing memory listing = listings[nftContractAddr][tokenId];
        address seller = listing.seller;
        uint256 price = listing.price;
        uint8 royaltyPercent = collections[nftContractAddr].royaltyPercent;
        address royaltyAddress = collections[nftContractAddr].royaltyAddr;
        uint256 marketFee = (price * marketFeePercent) / 100;
        uint256 royalty = (price * royaltyPercent) / 100;
        uint256 requiredPayment = price + marketFee + royalty;
        if (requiredPayment != msg.value) {
            revert NFTmarket__SentWrongValue();
        }
        delete listings[nftContractAddr][tokenId];
        marketFeeBalance += marketFee;
        usersProceeds[seller] += price;
        if (royaltyAddress != address(0) && royalty != 0) {
            usersProceeds[royaltyAddress] += royalty;
        }
        IERC721(nftContractAddr).safeTransferFrom(seller, msg.sender, tokenId);
        emit BoughtNFT(
            nftContractAddr,
            tokenId,
            msg.sender,
            seller,
            price,
            block.timestamp
        );
    }

    //seller must own the NFT; only seller can update the listing price of his/her NFT
    function updateListingPrice(
        address nftContractAddr,
        uint256 tokenId,
        uint256 newPrice
    )
        external
        isListed(nftContractAddr, tokenId)
        ownedBySeller(nftContractAddr, tokenId)
    {
        if (newPrice <= 0) {
            revert NFTmarket__PriceNotValid();
        }
        listings[nftContractAddr][tokenId].price = newPrice;
        emit UpdatedListingPrice(
            nftContractAddr,
            tokenId,
            newPrice,
            block.timestamp
        );
    }

    //both seller and market contract owner can delete a listing
    function deleteListing(
        address nftContractAddr,
        uint256 tokenId
    )
        external
        isListed(nftContractAddr, tokenId)
        marketOwnerOrSeller(nftContractAddr, tokenId)
    {
        delete listings[nftContractAddr][tokenId];
        emit DeletedListing(nftContractAddr, tokenId, block.timestamp);
    }

    function usersWithdraw() external nonReentrant {
        uint256 otherBalance = usersProceeds[msg.sender];
        if (otherBalance <= 0) revert NFTmarket__NoBalance();
        usersProceeds[msg.sender] = 0;
        (bool sentOther, ) = payable(msg.sender).call{value: otherBalance}("");
        if (!sentOther) {
            revert NFTmarket__SentUserFailed();
        }
        emit UserWithdrew(msg.sender, otherBalance, block.timestamp);
    }

    function ownerWithdrawFee(uint256 withdrawAmount) external onlyOwner {
        if (withdrawAmount > marketFeeBalance) {
            revert NFTmarket__NotEnoughBalance();
        }
        marketFeeBalance -= withdrawAmount;
        (bool sentOwner, ) = payable(msg.sender).call{value: withdrawAmount}(
            ""
        );
        if (!sentOwner) {
            revert NFTmarket__SentOwnerFailed();
        }
        emit MarketOwnerWithdrew(msg.sender, withdrawAmount, block.timestamp);
    }

    function getListing(
        address nftContractAddr,
        uint256 tokenId
    ) external view returns (address, uint256) {
        Listing memory listing = listings[nftContractAddr][tokenId];
        return (listing.seller, listing.price);
    }

    function getCollection(
        address nftContractAddr
    ) external view returns (address, uint8, string memory) {
        Collection memory collection = collections[nftContractAddr];
        return (
            collection.royaltyAddr,
            collection.royaltyPercent,
            collection.collectionURI
        );
    }

    function getUserProceed(address user) external view returns (uint256) {
        return usersProceeds[user];
    }

    function getMarketFeeBalance() external view returns (uint256) {
        return marketFeeBalance;
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
