const { network } = require("hardhat");
const {
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  if (chainId == 31337) {
    log("Local network detected! Deploying to a local network...");
  }
  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS;

  log("----------------------------------------------------");

  //arguments: 1.cost 2.maxSupply 3.maxMintAmount 4.allowMintingOn (Epoch Unix Timestamp)
  const arguments = [0, 50, 5, 1679665400];
  const boredStudentsNFT = await deploy("BoredStudentsNFT", {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmations: waitBlockConfirmations,
  });

  // Verify the deployment
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying...");
    await verify(boredStudentsNFT.address, arguments);
  }
  log("----------------------------------------------------");
};

module.exports.tags = ["all", "BoredStudentsNFT"];
