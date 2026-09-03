import { ModCallback } from "isaac-typescript-definitions";
import { name } from "../package.json";

export function main(): void {
  const mod = RegisterMod(name, 1);

  mod.AddCallback(ModCallback.POST_PLAYER_INIT, postPlayerInit);

  Isaac.DebugString(`${name} initialized.`);
}

function postPlayerInit() {
  Isaac.DebugString("Callback fired: POST_PLAYER_INIT");
}
