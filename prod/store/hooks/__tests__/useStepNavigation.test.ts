import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useStepNavigation } from '../useStepNavigation';
import { rootSlice } from '../../rootSlice';

const createTestStore = (initialSteps: any[] = []) => {
    return configureStore({
        reducer: {
            root: rootSlice.reducer,
        },
        preloadedState: {
            root: {
                steps: initialSteps,
                status: 'idle',
                error: null,
                productConfig: null,
                logikConfig: null,
                cartConfig: null,
                isCustomerService: false,
            },
        },
    });
};

const createWrapper = (store: any) => ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
);

describe('useStepNavigation', () => {
    describe('Navigation State', () => {
        it('should return null for previous step when on first step', () => {
            const steps = [
                { id: '1', name: 'Step 1', active: true, completed: false },
                { id: '2', name: 'Step 2', active: false, completed: false },
            ];
            
            const store = createTestStore(steps);
            const { result } = renderHook(() => useStepNavigation(), {
                wrapper: createWrapper(store),
            });

            expect(result.current.navigation.prevStep).toBeNull();
            expect(result.current.currentStepData?.id).toBe('1');
        });

        it('should return correct next step data', () => {
            const steps = [
                { id: '1', name: 'Step 1', active: true, completed: true },
                { id: '2', name: 'Step 2', active: false, completed: false },
            ];
            
            const store = createTestStore(steps);
            const { result } = renderHook(() => useStepNavigation(), {
                wrapper: createWrapper(store),
            });

            expect(result.current.nextStepData?.id).toBe('2');
            expect(result.current.navigation.nextStep?.isEnabled).toBe(true);
        });

        it('should return correct navigation state for middle step', () => {
            const steps = [
                { id: '1', name: 'Step 1', active: false, completed: true },
                { id: '2', name: 'Step 2', active: true, completed: true },
                { id: '3', name: 'Step 3', active: false, completed: false },
            ];
            
            const store = createTestStore(steps);
            const { result } = renderHook(() => useStepNavigation(), {
                wrapper: createWrapper(store),
            });

            expect(result.current.navigation.prevStep?.id).toBe('1');
            expect(result.current.navigation.nextStep?.id).toBe('3');
            expect(result.current.previousStepData?.id).toBe('1');
            expect(result.current.nextStepData?.id).toBe('3');
        });
    });

    describe('Navigation Actions', () => {
        it('should navigate to next step when current step is completed', () => {
            const steps = [
                { id: '1', name: 'Step 1', active: true, completed: true },
                { id: '2', name: 'Step 2', active: false, completed: false },
            ];
            
            const store = createTestStore(steps);
            const { result } = renderHook(() => useStepNavigation(), {
                wrapper: createWrapper(store),
            });

            act(() => {
                result.current.actions.goToNextStep();
            });

            const state = store.getState();
            expect(state.root.steps[0].active).toBe(false);
            expect(state.root.steps[1].active).toBe(true);
        });

        it('should navigate to previous step', () => {
            const steps = [
                { id: '1', name: 'Step 1', active: false, completed: true },
                { id: '2', name: 'Step 2', active: true, completed: false },
            ];
            
            const store = createTestStore(steps);
            const { result } = renderHook(() => useStepNavigation(), {
                wrapper: createWrapper(store),
            });

            act(() => {
                result.current.actions.goToPreviousStep();
            });

            const state = store.getState();
            expect(state.root.steps[0].active).toBe(true);
            expect(state.root.steps[1].active).toBe(false);
        });

        it('should not navigate to next step when current step is not completed', () => {
            const steps = [
                { id: '1', name: 'Step 1', active: true, completed: false },
                { id: '2', name: 'Step 2', active: false, completed: false },
            ];
            
            const store = createTestStore(steps);
            const { result } = renderHook(() => useStepNavigation(), {
                wrapper: createWrapper(store),
            });

            act(() => {
                result.current.actions.goToNextStep();
            });

            const state = store.getState();
            expect(state.root.steps[0].active).toBe(true);
            expect(state.root.steps[1].active).toBe(false);
        });
    });

    describe('Step Validation', () => {
        it('should return correct validity state for completed step', () => {
            const steps = [
                { id: '1', name: 'Step 1', active: true, completed: true },
                { id: '2', name: 'Step 2', active: false, completed: false },
            ];
            
            const store = createTestStore(steps);
            const { result } = renderHook(() => useStepNavigation(), {
                wrapper: createWrapper(store),
            });

            expect(result.current.currentStepValidity.isValid).toBe(true);
            expect(result.current.currentStepValidity.canAdvance).toBe(true);
        });

        it('should return correct validity state for incomplete step', () => {
            const steps = [
                { id: '1', name: 'Step 1', active: true, completed: false },
                { id: '2', name: 'Step 2', active: false, completed: false },
            ];
            
            const store = createTestStore(steps);
            const { result } = renderHook(() => useStepNavigation(), {
                wrapper: createWrapper(store),
            });

            expect(result.current.currentStepValidity.isValid).toBe(false);
            expect(result.current.currentStepValidity.canAdvance).toBe(false);
        });

        it('should mark current step as completed', () => {
            const steps = [
                { id: '1', name: 'Step 1', active: true, completed: false },
            ];
            
            const store = createTestStore(steps);
            const { result } = renderHook(() => useStepNavigation(), {
                wrapper: createWrapper(store),
            });

            act(() => {
                result.current.actions.markStepCompleted();
            });

            const state = store.getState();
            expect(state.root.steps[0].completed).toBe(true);
        });
    });

    describe('All Steps Completed', () => {
        it('should return true when all steps are completed', () => {
            const steps = [
                { id: '1', name: 'Step 1', active: false, completed: true },
                { id: '2', name: 'Step 2', active: true, completed: true },
            ];
            
            const store = createTestStore(steps);
            const { result } = renderHook(() => useStepNavigation(), {
                wrapper: createWrapper(store),
            });

            expect(result.current.allStepsCompleted).toBe(true);
        });

        it('should return false when not all steps are completed', () => {
            const steps = [
                { id: '1', name: 'Step 1', active: false, completed: true },
                { id: '2', name: 'Step 2', active: true, completed: false },
            ];
            
            const store = createTestStore(steps);
            const { result } = renderHook(() => useStepNavigation(), {
                wrapper: createWrapper(store),
            });

            expect(result.current.allStepsCompleted).toBe(false);
        });
    });
}); 