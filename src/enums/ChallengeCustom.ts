import { validateCustomEnum } from "isaacscript-common";

export const ChallengeCustom = {
  SPEEDRUN_TIMER: Isaac.GetChallengeIdByName("Speedrun Timer for Multi-Runs"),
} as const;

validateCustomEnum("ChallengeCustom", ChallengeCustom);
