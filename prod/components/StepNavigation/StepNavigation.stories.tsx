import type { Meta, StoryObj } from "@storybook/react";

import { StepNavigation, StepNavigationProps } from "~probuilder/components/StepNavigation";
import { getMockedStepNavigation, useStepNavigation } from "~probuilder/features/steps/hooks/useStepNavigation.mock";


interface StoryProps extends StepNavigationProps {
    mockedNavigation: ReturnType<typeof getMockedStepNavigation>;
}

const meta = {
    title: "Components/Step Navigation",
    component: StepNavigation,
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <div style={{ padding: "20px" }}>
                <Story />
            </div>
        )
    ]
} satisfies Meta<typeof StepNavigation>;

export default meta;
type Story = StoryObj<StoryProps>;

const Template: Story = {
    decorators: [
        (Story, { args }) => {
            useStepNavigation.mockReturnValue(args.mockedNavigation);
            return <Story />;
        }
    ]
};

export const FirstStep: Story = {
    ...Template,
    args: {
        mockedNavigation: getMockedStepNavigation({ activeStep: 0, hasSelections: false })
    }
};

export const FirstStepWithSelections: Story = {
    ...Template,
    args: {
        mockedNavigation: getMockedStepNavigation({ activeStep: 0, hasSelections: true })
    }
};

export const MiddleStepValid: Story = {
    ...Template,
    args: {
        mockedNavigation: getMockedStepNavigation({ activeStep: 2, hasSelections: true })
    }
};

export const MiddleStepInvalid: Story = {
    ...Template,
    args: {
        mockedNavigation: getMockedStepNavigation({ activeStep: 2, hasSelections: false })
    }
};

export const LastStep: Story = {
    ...Template,
    args: {
        mockedNavigation: getMockedStepNavigation({ activeStep: 4, hasSelections: true })
    }
};

export const WithValidationError: Story = {
    ...Template,
    args: {
        mockedNavigation: getMockedStepNavigation({
            activeStep: 1,
            hasSelections: false,
            error: new Error("Please make a selection in the previous step in order to complete your door configuration.")
        })
    }
};

export const LoadingState: Story = {
    ...Template,
    args: {
        mockedNavigation: {
            ...getMockedStepNavigation({ activeStep: 1, hasSelections: true }),
            status: "loading"
        }
    }
};

export const ErrorState: Story = {
    ...Template,
    args: {
        mockedNavigation: {
            ...getMockedStepNavigation({ 
                activeStep: 1, 
                hasSelections: false,
                error: new Error("Network error occurred")
            }),
            status: "failed"
        }
    }
};

export const AllStepsCompleted: Story = {
    ...Template,
    args: {
        mockedNavigation: getMockedStepNavigation({ 
            activeStep: 4, 
            hasSelections: true, 
            allStepsCompletedOverride: true 
        })
    }
};

export const InteractiveActions: Story = {
    ...Template,
    args: {
        mockedNavigation: getMockedStepNavigation({ activeStep: 2, hasSelections: true })
    },
    parameters: {
        docs: {
            description: {
                story: 'Test navigation actions in browser console.'
            }
        }
    }
};

export const WithPromoBanner: Story = {
    ...Template,
    args: {
        mockedNavigation: getMockedStepNavigation({ activeStep: 1, hasSelections: true }),
        showPromoBanner: true
    }
}; 