import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

// Replace with the actual deployed BatchRegistry address for your batch on Arbitrum!
const BATCH_REGISTRY_ADDRESS = "0x8b698d8f63f078369C067d58A4CC4B529F219CF7";

// Update with your EOA address (the one you control and funded with Arbitrum ETH)
const owner = "0x452fC452af3DCbC320400E8CA117EB71279B43c4";

const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // Only deploy on Arbitrum
  if (hre.network.name !== "arbitrum") {
    console.log("Skipping deployment: not on Arbitrum network.");
    return;
  }

  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Deploy CheckIn contract with BatchRegistry address and owner address
  await deploy("CheckIn", {
    from: deployer,
    args: [BATCH_REGISTRY_ADDRESS, owner],
    log: true,
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const checkIn = await hre.ethers.getContract<Contract>("CheckIn", owner);
  console.log("\nCheckIn deployed to:", await checkIn.getAddress());
  console.log("Remember to update the allow list in the BatchRegistry if needed!\n");
};

export default deployYourContract;
deployYourContract.tags = ["CheckIn"];
