import { validateCustomEnum } from "isaacscript-common";

export const ChallengeCustom = {
  SPEEDRUN_TIMER: Isaac.GetChallengeIdByName("Multi-Run Timer"),
} as const;

// eslint-disable-next-line unicorn/no-top-level-side-effects
validateCustomEnum("ChallengeCustom", ChallengeCustom);
