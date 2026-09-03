import { ModCallback } from "isaac-typescript-definitions";
import { ModCallbackCustom } from "isaacscript-common";
import { name } from "../package.json";
import { mod } from "./mod";

const v = {
  persistent: {
    totalNumRenderFrames: 0,
    runStartTime: null as int | null,
  },
};

export function main(): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_GAME_STARTED_REORDERED,
    postGameStartedReorderedFalse,
    false,
  );
  mod.AddCallback(ModCallback.POST_GAME_END, postGameEnd);
  mod.saveDataManager(name, v);

  Isaac.DebugString(`${name} initialized.`);
}

function postGameStartedReorderedFalse() {
  resetTimer();

  v.persistent.runStartTime = Isaac.GetTime();
}

function postGameEnd() {
  resetTimer();
}

function resetTimer() {
  if (v.persistent.runStartTime === null) {
    return;
  }

  const endTime = Isaac.GetTime();
  const elapsedTime = endTime - v.persistent.runStartTime;
  v.persistent.totalNumRenderFrames += elapsedTime;
  v.persistent.runStartTime = null;
}
