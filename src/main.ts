import {
  Keyboard,
  ModCallback,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  fonts,
  game,
  KColorDefault,
  log,
  onChallenge,
  RENDER_FRAMES_PER_SECOND,
  sfxManager,
  VectorZero,
} from "isaacscript-common";
import { name } from "../package.json";
import { ChallengeCustom } from "./enums/ChallengeCustom";
import { mod } from "./mod";

const HOTKEY = Keyboard.F2;
const blackSprite = Sprite();

const v = {
  persistent: {
    totalNumRenderFrames: 0,
  },
};

export function main(): void {
  mod.AddCallback(ModCallback.POST_RENDER, postRender); // 2

  mod.saveDataManager(name, v);
  mod.setHotkey(HOTKEY, () => {
    log("Multi-Run Timer reset hotkey pressed.");
    sfxManager.Play(SoundEffect.THUMBS_UP);
    v.persistent.totalNumRenderFrames = 0;
  });

  log(`${name} initialized.`);
}

// ModCallback.POST_RENDER (2)
function postRender() {
  if (onChallenge(ChallengeCustom.SPEEDRUN_TIMER)) {
    const hud = game.GetHUD();
    hud.SetVisible(false);

    drawBlackScreen();
    drawTimerInfo();

    const player = Isaac.GetPlayer();
    player.ControlsEnabled = false;
  } else {
    v.persistent.totalNumRenderFrames++;
  }
}

function drawBlackScreen() {
  if (!blackSprite.IsLoaded()) {
    blackSprite.Load("gfx/ui/boss/versusscreen.anm2", true);
    blackSprite.SetFrame("Scene", 0);
    blackSprite.Scale = Vector(100, 100);
  }

  blackSprite.RenderLayer(0, VectorZero);
}

function drawTimerInfo() {
  const seconds = v.persistent.totalNumRenderFrames / RENDER_FRAMES_PER_SECOND;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const lines = [
    "Multi-Run Timer",
    "",
    "This mod will keep track of the render frames that are spent",
    "while not in the main menu. However, the timer is frozen when",
    "you are inside this custom challenge.",
    "",
    "Time so far:",
    `${v.persistent.totalNumRenderFrames} render frames`,
    `= ${seconds} seconds`,
    `= ${minutes} minutes`,
    `= ${hours} hours`,
    "",
    `Press ${Keyboard[HOTKEY]} to reset the timer.`,
  ];

  let y = 30;
  for (const line of lines) {
    const isTitle = line === lines[0];
    const font = isTitle ? fonts.droid : fonts.droid;
    const scale = isTitle ? 1.5 : 1;
    font.DrawStringScaled(line, 50, y, scale, scale, KColorDefault);
    y += 20;
  }
}
