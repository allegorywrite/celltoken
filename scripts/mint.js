const apiKey = "LppS9R6tDg1gcdBzpiBeroLoeZ67xm87";
const cellToken = "0x5DbD1D62d6080E8a9e4dcD4549c20bea29b0B0ec";
const bobAddress = '0x33F08304a0aD08bA05633D60A9985BC39E92deE0';

async function mintAndTransfer() {
  const cellTokenFactory = await hre.ethers.getContractFactory("CellToken");
  const contract = await cellTokenFactory.attach(cellToken);
  const tx = await contract.mintAndTransfer(bobAddress);
  const receipt = await tx.wait();
  console.log(receipt);
}

mintAndTransfer()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });