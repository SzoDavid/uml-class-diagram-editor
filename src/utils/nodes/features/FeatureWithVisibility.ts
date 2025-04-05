import { Feature } from './Feature.ts';
import { Visibility } from '../types.ts';

export interface FeatureWithVisibility extends Feature {
    visibility: Visibility | null;
    omitVisibility: boolean;
}
