import { render, screen, fireEvent } from '@testing-library/react';
import { StepNavigation } from '../StepNavigation';

jest.mock('../../../store/hooks/useStepNavigation', () => ({
    useStepNavigation: jest.fn(),
}));

const mockUseStepNavigation = require('../../../store/hooks/useStepNavigation').useStepNavigation;

describe('StepNavigation Component', () => {
    beforeEach(() => {
        mockUseStepNavigation.mockClear();
    });

    describe('Button Rendering', () => {
        it('should render navigation buttons when steps are available', () => {
            mockUseStepNavigation.mockReturnValue({
                navigation: {
                    prevStep: {
                        id: '1',
                        label: 'Back',
                        isEnabled: true,
                        action: jest.fn(),
                    },
                    nextStep: {
                        id: '3',
                        label: 'Step 3',
                        isEnabled: true,
                        action: jest.fn(),
                    },
                },
                status: 'idle',
                error: null,
                allStepsCompleted: false,
            });

            render(<StepNavigation />);

            expect(screen.getByText('Back')).toBeInTheDocument();
            expect(screen.getByText('Step 3')).toBeInTheDocument();
        });

        it('should not render previous button when on first step', () => {
            mockUseStepNavigation.mockReturnValue({
                navigation: {
                    prevStep: null,
                    nextStep: {
                        id: '2',
                        label: 'Step 2',
                        isEnabled: true,
                        action: jest.fn(),
                    },
                },
                status: 'idle',
                error: null,
                allStepsCompleted: false,
            });

            render(<StepNavigation />);

            expect(screen.queryByText('Back')).not.toBeInTheDocument();
            expect(screen.getByText('Step 2')).toBeInTheDocument();
        });
    });

    describe('Button Actions', () => {
        it('should call navigation actions when buttons are clicked', () => {
            const mockPrevAction = jest.fn();
            const mockNextAction = jest.fn();

            mockUseStepNavigation.mockReturnValue({
                navigation: {
                    prevStep: {
                        id: '1',
                        label: 'Back',
                        isEnabled: true,
                        action: mockPrevAction,
                    },
                    nextStep: {
                        id: '3', 
                        label: 'Step 3',
                        isEnabled: true,
                        action: mockNextAction,
                    },
                },
                status: 'idle',
                error: null,
                allStepsCompleted: false,
            });

            render(<StepNavigation />);

            fireEvent.click(screen.getByText('Back'));
            fireEvent.click(screen.getByText('Step 3'));

            expect(mockPrevAction).toHaveBeenCalledTimes(1);
            expect(mockNextAction).toHaveBeenCalledTimes(1);
        });

        it('should call finalize action when finalize button is clicked', () => {
            const mockFinalizeAction = jest.fn();

            mockUseStepNavigation.mockReturnValue({
                navigation: {
                    prevStep: { id: '2', label: 'Back', isEnabled: true, action: jest.fn() },
                    nextStep: null,
                    finalizeAction: mockFinalizeAction,
                },
                status: 'idle',
                error: null,
                allStepsCompleted: true,
            });

            render(<StepNavigation />);

            const finalizeButton = screen.getByText('Finalize Door Configuration');
            fireEvent.click(finalizeButton);
            
            expect(mockFinalizeAction).toHaveBeenCalledTimes(1);
        });
    });

    describe('Button States', () => {
        it('should disable buttons when step is not valid for advancement', () => {
            mockUseStepNavigation.mockReturnValue({
                navigation: {
                    prevStep: { id: '1', label: 'Back', isEnabled: true, action: jest.fn() },
                    nextStep: { id: '3', label: 'Step 3', isEnabled: false, action: jest.fn() },
                },
                status: 'idle',
                error: null,
                allStepsCompleted: false,
            });

            render(<StepNavigation />);

            const previousButton = screen.getByText('Back');
            const nextButton = screen.getByText('Step 3');
            
            expect(previousButton).not.toBeDisabled();
            expect(nextButton).toBeDisabled();
        });

        it('should disable buttons when loading', () => {
            mockUseStepNavigation.mockReturnValue({
                navigation: {
                    prevStep: { id: '1', label: 'Back', isEnabled: true, action: jest.fn() },
                    nextStep: { id: '3', label: 'Step 3', isEnabled: true, action: jest.fn() },
                },
                status: 'loading',
                error: null,
                allStepsCompleted: false,
            });

            render(<StepNavigation />);

            const previousButton = screen.getByText('Back');
            const nextButton = screen.getByText('Step 3');
            
            expect(previousButton).toBeDisabled();
            expect(nextButton).toBeDisabled();
        });
    });

    describe('Last Step Behavior', () => {
        it('should show finalize button when on last step', () => {
            mockUseStepNavigation.mockReturnValue({
                navigation: {
                    prevStep: { id: '2', label: 'Back', isEnabled: true, action: jest.fn() },
                    nextStep: null,
                    finalizeAction: jest.fn(),
                },
                status: 'idle',
                error: null,
                allStepsCompleted: false,
            });

            render(<StepNavigation />);

            expect(screen.getByText('Finalize Door Configuration')).toBeInTheDocument();
        });

        it('should show finalize button in submit area when all steps completed', () => {
            mockUseStepNavigation.mockReturnValue({
                navigation: {
                    prevStep: { id: '2', label: 'Back', isEnabled: true, action: jest.fn() },
                    nextStep: null,
                    finalizeAction: jest.fn(),
                },
                status: 'idle',
                error: null,
                allStepsCompleted: true,
            });

            render(<StepNavigation />);

            const finalizeButtons = screen.getAllByText('Finalize Door Configuration');
            expect(finalizeButtons).toHaveLength(2);
        });
    });

    describe('Error Display', () => {
        it('should display error when provided', () => {
            mockUseStepNavigation.mockReturnValue({
                navigation: {
                    prevStep: null,
                    nextStep: null,
                },
                status: 'failed',
                error: {
                    name: 'Configuration Error',
                    message: 'Failed to load step data',
                },
                allStepsCompleted: false,
            });

            render(<StepNavigation />);

            expect(screen.getAllByText('Configuration Error')).toHaveLength(2);
            expect(screen.getAllByText('Failed to load step data')).toHaveLength(2);
        });
    });

    describe('Promo Banner', () => {
        it('should show promo banner when showPromoBanner is true', () => {
            mockUseStepNavigation.mockReturnValue({
                navigation: {
                    prevStep: null,
                    nextStep: null,
                },
                status: 'idle',
                error: null,
                allStepsCompleted: false,
            });

            render(<StepNavigation showPromoBanner={true} />);

            expect(screen.getByText('Faster lead times, 3-day fast track.')).toBeInTheDocument();
        });

        it('should not show promo banner by default', () => {
            mockUseStepNavigation.mockReturnValue({
                navigation: {
                    prevStep: null,
                    nextStep: null,
                },
                status: 'idle',
                error: null,
                allStepsCompleted: false,
            });

            render(<StepNavigation />);

            expect(screen.queryByText('Faster lead times, 3-day fast track.')).not.toBeInTheDocument();
        });
    });
}); 