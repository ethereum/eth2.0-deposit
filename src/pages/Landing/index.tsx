import React from "react";
import { Hero } from "./Hero";
import { NetworkStatus } from "./NetworkStatus";
import { StakingRewards } from "./StakingRewards";
import { TimelineMileStones } from "./TimelineMilestones";
import { Introduction } from "./Introduction";
import { SignupSteps } from "./SignupSteps";
import { PhaseZeroInfo } from "./PhaseZeroInfo";
import { CTAFooter } from "./CTAFooter";

export const LandingPage = (): JSX.Element => {
  return (
    <div>
      <Hero />
      <NetworkStatus />
      <StakingRewards />
      <TimelineMileStones />
      <Introduction />
      <SignupSteps />
      <PhaseZeroInfo />
      <CTAFooter />
    </div>
  );
};
