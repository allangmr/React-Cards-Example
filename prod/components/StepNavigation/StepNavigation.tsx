import { Button } from "~design-system/atomic/Button";
import { Container } from "~design-system/atomic/Container";
import { Column, Grid } from "~design-system/atomic/Grid";

import styles from "./StepNavigation.module.scss";

import defaultPromoImage from "~probuilder/assets/images/fast-track-production.png";
import { PromoBanner } from "~probuilder/components/PromoBanner";
import { StepsError } from "~probuilder/components/StepsError";
import { useStepNavigation } from "~probuilder/features/steps/hooks/useStepNavigation";

// Extend the Window interface to include viteBasePath
declare global {
    interface Window {
        viteBasePath?: string;
    }
}

export interface StepNavigationProps {
    showPromoBanner?: boolean;
}

/**
 * StepNavigation Component
 * A navigation component that displays Previous and Next buttons for stepping through the builder.
 */
export function StepNavigation({
    showPromoBanner = false
}: StepNavigationProps): React.ReactElement {
    const { navigation, status, error, allStepsCompleted } = useStepNavigation();
    const canGoBack = !!navigation.prevStep?.isEnabled;
    const canGoForward = !!navigation.nextStep?.isEnabled;
    const previousStepLabel = navigation.prevStep?.label ?? "Back";
    const nextStepLabel = navigation.nextStep?.label ?? "Next";
    const isLastStep = status !== "loading" && !navigation.nextStep;
    const showFinalizeButton = allStepsCompleted && !isLastStep;
    const assetBase = typeof window !== 'undefined' && window.viteBasePath ? window.viteBasePath : "/";

    return (
        <div className={styles["step-navigation"]}>
            <div className={styles["message-above"]}>
            {error?.name && error?.message && (
                <StepsError
                    title={error.name}
                    description={error.message}
                />
            )}
            </div>
            {showPromoBanner && (
                <PromoBanner
                    image={{
                        src: assetBase + defaultPromoImage,
                        alt: "Fast Track Production"
                    }}
                    message="Faster lead times, 3-day fast track."
                />
            )}
            <nav className={styles["navigation"]}>
                <Container className={styles["navigation-container"]}>
                    <Grid col={{ sm: 1, md: 12, lg: 12 }}>
                        <Column colSpan={{ sm: 1, md: 4, lg: 4 }}>
                            <div className={styles["message-inner"]}>
                                {error?.name && error?.message && (
                                    <StepsError
                                        title={error.name}
                                        description={error.message}
                                    />
                                )}
                            </div>
                        </Column>
                        <Column colSpan={{ sm: 1, md: 5, lg: 5 }}>
                            <div className={styles["buttons"]}>
                                {navigation?.prevStep && (
                                    <Button
                                        kind="tertiary"
                                        icon={{ name: "ChevronLeft", position: "left", size: 24 }}
                                        isDisabled={!canGoBack || status === "loading"}
                                        onClick={navigation.prevStep.action}
                                    >
                                        {previousStepLabel}
                                    </Button>
                                )}
                                {!isLastStep && navigation?.nextStep && (
                                    <Button
                                        kind="primary"
                                        icon={{ name: "ChevronRight", position: "right", size: 24 }}
                                        isDisabled={!canGoForward || status === "loading"}
                                        onClick={navigation.nextStep.action}
                                    >
                                        {nextStepLabel}
                                    </Button>
                                )}
                                {isLastStep && (
                                    <Button
                                        kind="primary"
                                        icon={{ name: "ChevronRight", position: "right", size: 24 }}
                                        isDisabled={!canGoForward}
                                        onClick={navigation.finalizeAction}
                                    >
                                        Finalize Door Configuration
                                    </Button>
                                )}
                            </div>
                        </Column>
                        <Column colSpan={{ sm: 1, md: 3, lg: 3 }}>
                            <div className={styles["submit"]}>
                                {showFinalizeButton && (
                                    <Button
                                        kind="primary"
                                        icon={{ name: "ChevronRight", position: "right", size: 24 }}
                                        isDisabled={!canGoForward}
                                        onClick={navigation.finalizeAction}
                                    >
                                        Finalize Door Configuration
                                    </Button>
                                )}
                            </div>
                        </Column>
                        <Column colSpan={{ sm: 1, md: 3, lg: 3 }}>
                            <div className={styles["submit"]} />
                        </Column>
                    </Grid>
                </Container>
            </nav>
        </div>
    );
} 