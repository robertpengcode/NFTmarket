const { expect } = require("chai");
const { network, ethers } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("NFTmarket", function () {
      let owner, user1, user2, user3, user4, nftmarket, testNFT, testPrice;
      before(async () => {
        [owner, user1, user2, user3, user4] = await ethers.getSigners();
        testPrice = ethers.utils.parseEther("0.001");
        const NFTmarket = await ethers.getContractFactory("NFTmarket");
        nftmarket = await NFTmarket.deploy(2);
        await nftmarket.deployed();
        const TestNFT = await ethers.getContractFactory("TestNFT");
        testNFT = await TestNFT.deploy();
        await testNFT.deployed();
        await testNFT.safeMint(user1.address, "test nft1 uri");
        await testNFT.safeMint(user2.address, "test nft2 uri");
        await testNFT.connect(user1).approve(nftmarket.address, 0);
      });

      describe("Deployment; safeMint; approve", () => {
        describe("NFTmarket", () => {
          it("Should set up market owner", async () => {
            expect(await nftmarket.marketOwner()).to.equal(owner.address);
          });
          it("Should set up market fee percent", async () => {
            expect((await nftmarket.marketFeePercent()).toString()).to.equal(
              "2"
            );
          });
        });
        describe("TestNFT", () => {
          it("Should set up token symbol", async () => {
            expect(await testNFT.symbol()).to.equal("TET");
          });
          it("Should mint a NFT to user1", async () => {
            expect(await testNFT.ownerOf(0)).to.equal(user1.address);
          });
          it("Should mint a NFT to user2", async () => {
            expect(await testNFT.ownerOf(1)).to.equal(user2.address);
          });
          it("User1 should approve the NFT market", async () => {
            expect(await testNFT.getApproved(0)).to.equal(nftmarket.address);
          });
        });
      });

      describe("List NFT", () => {
        it("Should not list NFT - not NFT owner", async () => {
          await expect(
            nftmarket.connect(user2).listNFT(testNFT.address, 0, testPrice)
          ).to.be.revertedWithCustomError(nftmarket, "NFTmarket__NotNftOwner");
        });
        it("Should not list NFT - price not valid", async () => {
          await expect(
            nftmarket.connect(user1).listNFT(testNFT.address, 0, 0)
          ).to.be.revertedWithCustomError(
            nftmarket,
            "NFTmarket__PriceNotValid"
          );
        });
        it("Should list NFT - event ListedNFT", async () => {
          await expect(
            nftmarket.connect(user1).listNFT(testNFT.address, 0, testPrice)
          ).to.emit(nftmarket, "ListedNFT");
        });
        it("Should list NFT - set price & seller", async () => {
          expect((await nftmarket.getListing(testNFT.address, 0))[0]).to.equal(
            user1.address
          );
          expect((await nftmarket.getListing(testNFT.address, 0))[1]).to.equal(
            testPrice
          );
        });
        it("Should not list NFT - not already listed", async () => {
          await expect(
            nftmarket.connect(user1).listNFT(testNFT.address, 0, testPrice)
          ).to.be.revertedWithCustomError(
            nftmarket,
            "NFTmarket__AlreadyListed"
          );
        });
        it("Should not list NFT - not approved by seller", async () => {
          await expect(
            nftmarket.connect(user2).listNFT(testNFT.address, 1, testPrice)
          ).to.be.revertedWithCustomError(
            nftmarket,
            "NFTmarket__NotApprovedBySeller"
          );
        });
      });

      describe("Buy NFT", () => {
        it("Should not buy NFT - not listed", async () => {
          await expect(
            nftmarket
              .connect(user3)
              .buyNFT(testNFT.address, 1, { value: testPrice })
          ).to.be.revertedWithCustomError(nftmarket, "NFTmarket__NotListed");
        });
        it("Should not buy NFT - sent wrong value", async () => {
          await expect(
            nftmarket
              .connect(user3)
              .buyNFT(testNFT.address, 0, { value: testPrice - 1000 })
          ).to.be.revertedWithCustomError(
            nftmarket,
            "NFTmarket__SentWrongValue"
          );
        });
        it("Should buy NFT - event BoughtNFT", async () => {
          await expect(
            nftmarket
              .connect(user3)
              .buyNFT(testNFT.address, 0, { value: testPrice })
          ).to.emit(nftmarket, "BoughtNFT");
        });
        it("Should has a new owner", async () => {
          expect(await testNFT.ownerOf(0)).to.equal(user3.address);
        });
        it("Should be removed from listing", async () => {
          expect((await nftmarket.getListing(testNFT.address, 0))[1]).to.equal(
            0
          );
          expect(
            (await nftmarket.getListing(testNFT.address, 0))[0].slice(0, 7)
          ).to.equal("0x00000");
        });
        it("Should update seller's proceed", async () => {
          expect(await nftmarket.getSellerProceed(user1.address)).to.equal(
            ((testPrice * 98) / 100).toString()
          );
        });
      });

      describe("Update Listing Price", () => {
        before(async () => {
          await testNFT.connect(user2).approve(nftmarket.address, 1);
          await nftmarket.connect(user2).listNFT(testNFT.address, 1, testPrice);
          await testNFT.safeMint(user1.address, "test nft3 uri");
        });
        it("Should not update listing price - not NFT owner", async () => {
          await expect(
            nftmarket
              .connect(user1)
              .updateListingPrice(testNFT.address, 1, testPrice * 2)
          ).to.be.revertedWithCustomError(nftmarket, "NFTmarket__NotNftOwner");
        });
        it("Should not update listing price - not listed", async () => {
          await expect(
            nftmarket
              .connect(user1)
              .updateListingPrice(testNFT.address, 2, testPrice * 2)
          ).to.be.revertedWithCustomError(nftmarket, "NFTmarket__NotListed");
        });
        it("Should not update listing price - price not valid", async () => {
          await expect(
            nftmarket.connect(user2).updateListingPrice(testNFT.address, 1, 0)
          ).to.be.revertedWithCustomError(
            nftmarket,
            "NFTmarket__PriceNotValid"
          );
        });
        it("Should update listing price - event UpdatedListingPrice", async () => {
          await expect(
            nftmarket
              .connect(user2)
              .updateListingPrice(testNFT.address, 1, testPrice * 2)
          ).to.emit(nftmarket, "UpdatedListingPrice");
        });
        it("Should update listing price - new price", async () => {
          expect((await nftmarket.getListing(testNFT.address, 1))[1]).to.equal(
            testPrice * 2
          );
        });
      });

      describe("delete Listing", () => {
        it("Should not delete listing - not NFT or market owner", async () => {
          await expect(
            nftmarket.connect(user1).deleteListing(testNFT.address, 1)
          ).to.be.revertedWithCustomError(
            nftmarket,
            "NFTmarket__NotMarketOwnerOrSeller"
          );
        });
        it("Should not delete listing - not listed", async () => {
          await expect(
            nftmarket.connect(user1).deleteListing(testNFT.address, 2)
          ).to.be.revertedWithCustomError(nftmarket, "NFTmarket__NotListed");
        });
        it("Should delete listing price - event DeletedListing", async () => {
          await expect(
            nftmarket.connect(user2).deleteListing(testNFT.address, 1)
          ).to.emit(nftmarket, "DeletedListing");
        });
        it("Should remove it from listing", async () => {
          expect((await nftmarket.getListing(testNFT.address, 1))[1]).to.equal(
            0
          );
          expect(
            (await nftmarket.getListing(testNFT.address, 1))[0].slice(0, 7)
          ).to.equal("0x00000");
        });
      });

      describe("Seller Withdraw", () => {
        it("Should not withdraw proceed - no balance", async () => {
          await expect(
            nftmarket.connect(user2).sellerWithdraw()
          ).to.be.revertedWithCustomError(nftmarket, "NFTmarket__NoBalance");
        });
        // it("Seller should withdraw proceed - event SellerWithdrew", async () => {
        //   await expect(nftmarket.connect(user1).sellerWithdraw()).to.emit(
        //     nftmarket,
        //     "SellerWithdrew"
        //   );
        // });
        it("Seller should withdraw proceed - account balances changed", async () => {
          const change = (testPrice * 98) / 100;
          await expect(
            nftmarket.connect(user1).sellerWithdraw()
          ).to.changeEtherBalances(
            [nftmarket.address, user1],
            [-change, change]
          );
        });
        it("Should set seller's proceed to 0", async () => {
          expect(await nftmarket.getSellerProceed(user1.address)).to.equal(0);
        });
      });

      describe("Market Owner Withdraw", () => {
        it("Should not withdraw - not market owner", async () => {
          await expect(
            nftmarket.connect(user1).marketOwnerWithdraw()
          ).to.be.revertedWith("Ownable: caller is not the owner");
        });
        // it("Seller should withdraw proceed - event MarketOwnerWithdrew", async () => {
        //   await expect(nftmarket.marketOwnerWithdraw()).to.emit(
        //     nftmarket,
        //     "MarketOwnerWithdrew"
        //   );
        // });
        it("Should withdraw balance - account balances changed", async () => {
          const change = (testPrice * 2) / 100;
          await expect(nftmarket.marketOwnerWithdraw()).to.changeEtherBalances(
            [nftmarket.address, owner.address],
            [-change, change]
          );
        });
        it("Should not withdraw proceed - no balance", async () => {
          await expect(
            nftmarket.marketOwnerWithdraw()
          ).to.be.revertedWithCustomError(nftmarket, "NFTmarket__NoBalance");
        });
      });
    });
