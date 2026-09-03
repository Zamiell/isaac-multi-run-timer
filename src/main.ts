import { ModCallback } from "isaac-typescript-definitions";
import {
  ModCallbackCustom,
  onChallenge,
  RENDER_FRAMES_PER_SECOND,
} from "isaacscript-common";
import { name } from "../package.json";
import { ChallengeCustom } from "./enums/ChallengeCustom";
import { mod } from "./mod";

const v = {
  persistent: {
    totalNumRenderFrames: 0,
    runStartTime: null as int | null,
  },
};

export function main(): void {
  registerVanillaCallbacks();
  registerCustomCallbacks();
  mod.saveDataManager(name, v);
  Isaac.DebugString(`${name} initialized.`);
}

function registerVanillaCallbacks() {
  mod.AddCallback(ModCallback.POST_RENDER, postRender); // 2
  mod.AddCallback(ModCallback.POST_GAME_END, postGameEnd); // 16
}

function registerCustomCallbacks() {
  mod.AddCallbackCustom(
    ModCallbackCustom.INPUT_ACTION_FILTER,
    inputActionFilter,
  );
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_GAME_STARTED_REORDERED,
    postGameStartedReorderedFalse,
    false,
  );
}

// ModCallback.POST_RENDER (16)
function postRender() {
  if (onChallenge(ChallengeCustom.SPEEDRUN_TIMER)) {
    drawTimerInfo();
  }
}

function drawTimerInfo() {
  const seconds = v.persistent.totalNumRenderFrames / RENDER_FRAMES_PER_SECOND;
  const minutes = seconds / 60;
  const hours = seconds / 60;
  const lines = [
    "Multi-Run Timer",
    "The timer is frozen when you are inside this custom challenge.",
    "Time so far:",
    `${v.persistent.totalNumRenderFrames} render frames = ${seconds} seconds = ${minutes} minutes = ${hours} hours`,
    "Press F2 to reset the timer.",
  ];

  let y = 30;
  for (const line of lines) {
    Isaac.RenderText(line, 50, y, 1, 1, 1, 255);
    y += 20;
  }
}

// ModCallback.POST_GAME_END (16)
function postGameEnd() {
  if (onChallenge(ChallengeCustom.SPEEDRUN_TIMER)) {
    return;
  }

  resetTimer();
}

// ModCallbackCustom.INPUT_ACTION_FILTER
function inputActionFilter(): boolean | float | undefined {
  // TODO
  return undefined;
}

// ModCallbackCustom.POST_GAME_STARTED_REORDERED
function postGameStartedReorderedFalse() {
  if (onChallenge(ChallengeCustom.SPEEDRUN_TIMER)) {
    return;
  }

  resetTimer();

  v.persistent.runStartTime = Isaac.GetTime();
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
