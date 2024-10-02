import {Feature} from './Feature.ts';

export interface FeatureLine {
    text: string,
    tabbed: boolean;
}

export interface MultilineFeature extends Feature {
    toMultilineString(): FeatureLine[];
}

export const IsMultilineFeature = (feature: Feature): feature is MultilineFeature => {
    return 'toMultilineString' in feature;
};