const destination = '0x33F08304a0aD08bA05633D60A9985BC39E92deE0';

async function main() {
  const factory = await ethers.getContractFactory("CellToken");
  const contract = await factory.deploy();
  console.log("NFT Deployed to:", contract.address);
  await contract.mintAndTransfer(destination);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
