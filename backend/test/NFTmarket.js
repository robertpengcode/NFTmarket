const { expect } = require("chai");
const { network, ethers } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("NFTmarket", function () {
      let owner, user1, user2, user3, user4, nftmarket, testNFT, testPrice;
      const emptyAddress = "0x0000000000000000000000000000000000000000";
      before(async () => {
        [owner, user1, user2, user3, user4] = await ethers.getSigners();
        testPrice = ethers.utils.parseEther("0.001");
        testWithdraw = ethers.utils.parseEther("0.00001");
        const NFTmarket = await ethers.getContractFactory("NFTmarket");
        //2% market fee
        nftmarket = await NFTmarket.deploy(2);
        await nftmarket.deployed();

        const TestNFT = await ethers.getContractFactory("TestNFT");
        testNFT = await TestNFT.deploy();
        await testNFT.deployed();

        const BoredStudentsNFT = await ethers.getContractFactory(
          "BoredStudentsNFT"
        );
        boredStudentsNFT = await BoredStudentsNFT.deploy(0, 50, 5, 1679665400);
        await boredStudentsNFT.deployed();

        await testNFT.safeMint(user1.address, "test nft1 uri");
        await testNFT.safeMint(user2.address, "test nft2 uri");
        await testNFT.connect(user1).approve(nftmarket.address, 0);
      });

      describe("Deployment; safeMint; approve", () => {
        describe("NFTmarket", () => {
          it("Should set up market owner", async () => {
            expect(await nftmarket.owner()).to.equal(owner.address);
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

      describe("Update Market Fee", () => {
        it("Should not update market fee - not market owner", async () => {
          await expect(
            nftmarket.connect(user1).updateMarketFee(3)
          ).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should update market fee", async () => {
          await nftmarket.updateMarketFee(3);
          expect(await nftmarket.marketFeePercent()).to.equal(3);
        });
      });

      describe("Create Collection", () => {
        it("Should not create collection - not market owner", async () => {
          await expect(
            nftmarket
              .connect(user1)
              .createCollection(
                testNFT.address,
                testNFT.owner(),
                2,
                "test collection uri"
              )
          ).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should create collection - event CreatedCollection", async () => {
          await expect(
            nftmarket.createCollection(
              testNFT.address,
              testNFT.owner(),
              2,
              "test collection uri"
            )
          ).to.emit(nftmarket, "CreatedCollection");
        });

        it("Should not create collection - created already", async () => {
          await expect(
            nftmarket.createCollection(
              testNFT.address,
              testNFT.owner(),
              2,
              "test collection uri"
            )
          ).to.be.revertedWithCustomError(
            nftmarket,
            "NFTmarket__CollectionAlreadyCreated"
          );
        });

        it("Should - set royalty address, percent, uri", async () => {
          expect((await nftmarket.getCollection(testNFT.address))[0]).to.equal(
            await testNFT.owner()
          );
          expect((await nftmarket.getCollection(testNFT.address))[1]).to.equal(
            2
          );
          expect((await nftmarket.getCollection(testNFT.address))[2]).to.equal(
            "test collection uri"
          );
        });
      });

      describe("Update Collection", () => {
        it("Should not update collection - not market owner", async () => {
          await expect(
            nftmarket
              .connect(user1)
              .updateCollection(
                testNFT.address,
                user3.address,
                3,
                "test collection uri updated"
              )
          ).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should not update collection - collection does not exist", async () => {
          await expect(
            nftmarket.updateCollection(
              boredStudentsNFT.address,
              user3.address,
              3,
              "test collection uri updated"
            )
          ).to.be.revertedWithCustomError(
            nftmarket,
            "NFTmarket__CollectionNotCreated"
          );
        });

        it("Should update collection - event UpdatedCollection", async () => {
          await expect(
            nftmarket.updateCollection(
              testNFT.address,
              user3.address,
              3,
              "test collection uri updated"
            )
          ).to.emit(nftmarket, "UpdatedCollection");
        });

        it("Should - update royalty address, percent, uri", async () => {
          expect((await nftmarket.getCollection(testNFT.address))[0]).to.equal(
            user3.address
          );
          expect((await nftmarket.getCollection(testNFT.address))[1]).to.equal(
            3
          );
          expect((await nftmarket.getCollection(testNFT.address))[2]).to.equal(
            "test collection uri updated"
          );
        });
      });

      describe("Delete Collection", () => {
        it("Should not delete collection - not market owner", async () => {
          await expect(
            nftmarket.connect(user1).deleteCollection(testNFT.address)
          ).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should not delete collection - collection does not exist", async () => {
          await expect(
            nftmarket.deleteCollection(boredStudentsNFT.address)
          ).to.be.revertedWithCustomError(
            nftmarket,
            "NFTmarket__CollectionNotCreated"
          );
        });

        it("Should delete collection - event DeletedCollection", async () => {
          await expect(nftmarket.deleteCollection(testNFT.address)).to.emit(
            nftmarket,
            "DeletedCollection"
          );
        });

        it("Should - update royalty address, percent, uri", async () => {
          expect((await nftmarket.getCollection(testNFT.address))[0]).to.equal(
            emptyAddress
          );
          expect((await nftmarket.getCollection(testNFT.address))[1]).to.equal(
            0
          );
          expect((await nftmarket.getCollection(testNFT.address))[2]).to.equal(
            ""
          );
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
        let marketFeePercent;
        let royalty;
        before(async () => {
          marketFeePercent = await nftmarket.marketFeePercent();
          await nftmarket.createCollection(
            testNFT.address,
            testNFT.owner(),
            2,
            "test collection uri"
          );
          royalty = (await nftmarket.getCollection(testNFT.address))[1];
        });
        it("Should not buy NFT - not listed", async () => {
          await expect(
            nftmarket.connect(user3).buyNFT(testNFT.address, 1, {
              value: testPrice * (1 + (marketFeePercent + royalty) / 100),
            })
          ).to.be.revertedWithCustomError(nftmarket, "NFTmarket__NotListed");
        });
        it("Should not buy NFT - sent wrong value", async () => {
          await expect(
            nftmarket
              .connect(user3)
              .buyNFT(testNFT.address, 0, { value: testPrice })
          ).to.be.revertedWithCustomError(
            nftmarket,
            "NFTmarket__SentWrongValue"
          );
        });
        it("Should buy NFT - event BoughtNFT", async () => {
          await expect(
            nftmarket.connect(user3).buyNFT(testNFT.address, 0, {
              value: testPrice * (1 + (marketFeePercent + royalty) / 100),
            })
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
          expect(await nftmarket.getUserProceed(user1.address)).to.equal(
            testPrice.toString()
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
            nftmarket.connect(user2).usersWithdraw()
          ).to.be.revertedWithCustomError(nftmarket, "NFTmarket__NoBalance");
        });
        // it("Seller should withdraw proceed - event SellerWithdrew", async () => {
        //   await expect(nftmarket.connect(user1).usersWithdraw()).to.emit(
        //     nftmarket,
        //     "UserWithdrew"
        //   );
        // });
        it("Seller should withdraw proceed - account balances changed", async () => {
          const change = testPrice;
          await expect(
            nftmarket.connect(user1).usersWithdraw()
          ).to.changeEtherBalances(
            [nftmarket.address, user1],
            [-change, change]
          );
        });
        it("Should set seller's proceed to 0", async () => {
          expect(await nftmarket.getUserProceed(user1.address)).to.equal(0);
        });
      });

      describe("Market Owner Withdraw", () => {
        it("Should not withdraw - not market owner", async () => {
          await expect(
            nftmarket.connect(user1).ownerWithdrawFee(testWithdraw)
          ).to.be.revertedWith("Ownable: caller is not the owner");
        });
        it("Market owner should withdraw proceed - event MarketOwnerWithdrew", async () => {
          await expect(nftmarket.ownerWithdrawFee(testWithdraw)).to.emit(
            nftmarket,
            "MarketOwnerWithdrew"
          );
        });
        it("Should withdraw balance - account balances changed", async () => {
          const change = testWithdraw;
          await expect(
            nftmarket.ownerWithdrawFee(testWithdraw)
          ).to.changeEtherBalances(
            [nftmarket.address, owner.address],
            [-change, change]
          );
        });
        it("Should not withdraw proceed - no balance", async () => {
          await expect(
            nftmarket.ownerWithdrawFee(testPrice)
          ).to.be.revertedWithCustomError(
            nftmarket,
            "NFTmarket__NotEnoughBalance"
          );
        });
      });
    });
