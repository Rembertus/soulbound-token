# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test                    # for all test
npx hardhat test test/sbt.test.ts   # for unit test
npx hardhat test test/sbt-deployed.test.ts   # for unit test in deploy
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/SoulBoundToken.ts --network localhost
npx hardhat ignition deploy ./ignition/modules/SouldboundToken.ts  --OR-- 
npx hardhat run --network localhost scripts/deploy.ts --OR--              # for local deploy
npx hardhat ignition deploy ./ignition/modules/SouldboundToken.ts --network hardhat  # for local deploy
npx hardhat ignition deploy ./ignition/modules/Token.js --network <network-name>   # for network in hardhatconfig.ts
```
