// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract BoredStudentsNFT is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    Pausable,
    Ownable
{
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIdCounter;
    uint256 public cost;
    uint256 public maxSupply;
    uint256 public allowMintingAfter;
    uint256 public maxMintAmount;
    uint256 public timeDeployed;
    bool public isPaused = false;
    bool public isRevealed = true;
    string public baseURI =
        "https://ipfs.io/ipfs/QmXUX182nXo41dmSN4Ndht34rrS8GVSptyTgZdkXpsbLRS";

    string public baseExtension = ".json";
    //string public notRevealedUri;

    event WithdrawByOwner(address indexed owner, uint256 amount, uint256 time);
    event MintedNFT(
        address indexed nftOwner,
        uint256 indexed tokenId,
        uint256 time
    );

    error BoredStudentsNFT__MintNotAllowedYet();
    error BoredStudentsNFT__OverMaxMintAmount();
    error BoredStudentsNFT__MintAmountMustOverZero();
    error BoredStudentsNFT__OverMaxSupply();
    error BoredStudentsNFT__SentIncorrectValue();
    error BoredStudentsNFT__SentOwnerFailed();

    constructor(
        uint256 _cost,
        uint256 _maxSupply,
        uint256 _maxMintAmount,
        //string memory _initBaseURI,
        uint256 _allowMintingOn
    )
        //string memory _initNotRevealedUri
        ERC721("Bored Students", "BST")
    {
        cost = _cost;
        maxSupply = _maxSupply;
        maxMintAmount = _maxMintAmount;
        //setBaseURI(_initBaseURI);
        timeDeployed = block.timestamp;
        if (_allowMintingOn > block.timestamp) {
            allowMintingAfter = _allowMintingOn - block.timestamp;
        }
        //setNotRevealedURI(_initNotRevealedUri);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function mint(uint256 _mintAmount) external payable {
        require(!isPaused);
        if (block.timestamp < timeDeployed + allowMintingAfter) {
            revert BoredStudentsNFT__MintNotAllowedYet();
        }
        if (_mintAmount > maxMintAmount) {
            revert BoredStudentsNFT__OverMaxMintAmount();
        }
        if (_mintAmount < 0) {
            revert BoredStudentsNFT__MintAmountMustOverZero();
        }
        uint256 supply = totalSupply();
        if (supply + _mintAmount > maxSupply) {
            revert BoredStudentsNFT__OverMaxSupply();
        }
        if (msg.sender != owner() && msg.value != cost * _mintAmount) {
            revert BoredStudentsNFT__SentIncorrectValue();
        }
        for (uint8 i = 0; i < _mintAmount; i++) {
            uint256 tokenId = _tokenIdCounter.current() + 1;
            _tokenIdCounter.increment();
            _safeMint(msg.sender, tokenId);
            string memory uri = getURI(tokenId);
            _setTokenURI(tokenId, uri);
            emit MintedNFT(msg.sender, tokenId, block.timestamp);
        }
    }

    function getURI(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "nonexistent token");
        // if (isRevealed == false) {
        //     return notRevealedUri;
        // }
        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        //currentBaseURI,
                        "/",
                        tokenId.toString(),
                        baseExtension
                    )
                )
                : "";
    }

    // Only Owner Functions
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool sentOwner, ) = payable(msg.sender).call{value: balance}("");
        if (!sentOwner) {
            revert BoredStudentsNFT__SentOwnerFailed();
        }
        emit WithdrawByOwner(msg.sender, balance, block.timestamp);
    }

    function setIsRevealed(bool _state) public onlyOwner {
        isRevealed = _state;
    }

    function setCost(uint256 _newCost) public onlyOwner {
        cost = _newCost;
    }

    function setmaxMintAmount(uint256 _newmaxMintAmount) public onlyOwner {
        maxMintAmount = _newmaxMintAmount;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function setBaseExtension(
        string memory _newBaseExtension
    ) public onlyOwner {
        baseExtension = _newBaseExtension;
    }

    function setIsPaused(bool _state) public onlyOwner {
        isPaused = _state;
    }

    // function setNotRevealedURI(string memory _notRevealedURI) public onlyOwner {
    //     notRevealedUri = _notRevealedURI;
    // }

    function getTokenIdsByOwner(
        address _owner
    ) public view returns (uint256[] memory) {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        for (uint256 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    function getSecondsUntilMinting() public view returns (uint256) {
        if (block.timestamp < timeDeployed + allowMintingAfter) {
            return (timeDeployed + allowMintingAfter) - block.timestamp;
        } else {
            return 0;
        }
    }

    // The following functions are overrides required by Solidity.

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
