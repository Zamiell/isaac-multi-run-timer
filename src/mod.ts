import { ISCFeature, upgradeMod } from "isaacscript-common";
import { name } from "../package.json";

const modVanilla = RegisterMod(name, 1);
const features = [
  ISCFeature.CUSTOM_HOTKEYS,
  ISCFeature.SAVE_DATA_MANAGER,
] as const;
export const mod = upgradeMod(modVanilla, features);
