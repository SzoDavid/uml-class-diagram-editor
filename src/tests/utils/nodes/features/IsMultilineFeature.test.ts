import { describe, expect, test } from 'vitest';
import { Parameter } from '../../../../utils/nodes/features/Parameter.ts';
import {
    IsMultilineFeature,
    MultilineFeature,
} from '../../../../utils/nodes/features/MultilineFeature.ts';
import { Feature } from '../../../../utils/nodes/features/Feature.ts';

describe('UCDE-IsMultilineFeature', () => {
    test('UCDE-IMF-01 GIVEN a feature object WHEN the object has all MultilineFeature properties THEN it should return true', () => {
        const multilineFeature: MultilineFeature = {
            toMultilineString: () => [],
            validate: () => [],
            clone: () => new Parameter('name'),
            toString: () => 'featureText;',
        };

        expect(IsMultilineFeature(multilineFeature)).toBe(true);
    });

    test('UCDE-IMF-02 GIVEN a feature object WHEN the object is missing MultilineFeature properties THEN it should return false', () => {
        const simpleFeature: Feature = {
            validate: () => [],
            clone: () => new Parameter('name'),
            toString: () => 'featureText',
        };

        expect(IsMultilineFeature(simpleFeature)).toBe(false);
    });

    test('UCDE-IMF-03 GIVEN a feature object WHEN the object has extra properties but is a valid MultilineFeature THEN it should return true', () => {
        const extendedMultilineFeature = {
            extraProperty: 'extra',
            toMultilineString: () => [],
            validate: () => [],
            clone: () => new Parameter('name'),
            toString: () => '+ extendedFeature;',
        };

        expect(IsMultilineFeature(extendedMultilineFeature)).toBe(true);
    });
});
