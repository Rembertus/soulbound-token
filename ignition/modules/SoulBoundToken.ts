import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SoulBoundTokenModule = buildModule("SoulBoundTokenModule", (m) => {
  const soulBoundToken = m.contract("SoulBoundToken");
  return { soulBoundToken };
});

export default SoulBoundTokenModule;
