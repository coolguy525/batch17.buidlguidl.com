import { ethers } from "hardhat";
import { expect } from "chai";

describe("CheckIn integration", function () {
  let owner: any, other: any;
  let batchRegistry: any, checkIn: any;

  beforeEach(async function () {
    [owner, other] = await ethers.getSigners();

    // Deploy BatchRegistry
    const BatchRegistry = await ethers.getContractFactory("BatchRegistry");
    batchRegistry = await BatchRegistry.deploy(owner.address, 17);
    await batchRegistry.waitForDeployment();

    // Deploy CheckIn with BatchRegistry address and owner
    const CheckIn = await ethers.getContractFactory("CheckIn");
    checkIn = await CheckIn.deploy(await batchRegistry.getAddress(), owner.address);
    await checkIn.waitForDeployment();

    // Add EOA owner to allow list (not the CheckIn contract)
    await batchRegistry.connect(owner).updateAllowList([owner.address], [true]);
  });

  it("should allow owner to check in via CheckIn contract", async function () {
    // Call checkInBatch as owner
    await expect(checkIn.connect(owner).checkInBatch())
      .to.emit(batchRegistry, "CheckedIn")
      .withArgs(true, owner.address, checkIn.target);

    // Confirm check-in recorded
    expect(await batchRegistry.yourContractAddress(owner.address)).to.equal(checkIn.target);
  });

  it("should not allow non-owner to call checkInBatch", async function () {
    await expect(checkIn.connect(other).checkInBatch()).to.be.revertedWithCustomError(
      checkIn,
      "OwnableUnauthorizedAccount",
    );
  });

  it("should revert if not in allow list", async function () {
    // Remove from allow list
    await batchRegistry.connect(owner).updateAllowList([owner.address], [false]);
    await expect(checkIn.connect(owner).checkInBatch()).to.be.revertedWithCustomError(batchRegistry, "NotInAllowList");
  });
});
