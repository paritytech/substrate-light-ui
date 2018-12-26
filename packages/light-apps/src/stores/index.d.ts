import { OnboardingStoreInterface } from './interfaces';

declare module 'stores' {
    export function onboardingStore (): OnboardingStoreInterface;
}
