import { describe, expect, test } from 'vitest';
import {
    IsDecoratedFeature,
    DecoratedFeature,
} from '../../../../utils/nodes/features/DecoratedFeature';
import { Feature } from '../../../../utils/nodes/features/Feature';
import { Parameter } from '../../../../utils/nodes/features/Parameter.ts';

describe('UCDE-IsDecoratedFeature', () => {
    test('UCDE-IDF-01 GIVEN a feature object WHEN the object has all DecoratedFeature properties THEN it should return true', () => {
        const decoratedFeature: DecoratedFeature = {
            prefix: '+',
            text: 'featureText',
            postfix: ';',
            decorator: 'underline',
            validate: () => [],
            clone: () => new Parameter('name'),
            toString: () => '+ featureText;',
        };

        expect(IsDecoratedFeature(decoratedFeature)).toBe(true);
    });

    test('UCDE-IDF-02 GIVEN a feature object WHEN the object is missing DecoratedFeature properties THEN it should return false', () => {
        const simpleFeature: Feature = {
            validate: () => [],
            clone: () => new Parameter('name'),
            toString: () => 'feature2',
        };

        expect(IsDecoratedFeature(simpleFeature)).toBe(false);
    });

    test('UCDE-IDF-03 GIVEN a feature object WHEN the object has some but not all DecoratedFeature properties THEN it should return false', () => {
        const partiallyDecoratedFeature = {
            name: 'feature3',
            prefix: '+',
            text: 'partialFeature',
            validate: () => [],
            clone: () => new Parameter('name'),
            toString: () => '+ partialFeature',
        };

        expect(IsDecoratedFeature(partiallyDecoratedFeature)).toBe(false);
    });

    test('UCDE-IDF-04 GIVEN a feature object WHEN the object has extra properties but is a valid DecoratedFeature THEN it should return true', () => {
        const extendedDecoratedFeature = {
            name: 'feature4',
            prefix: '+',
            text: 'extendedFeature',
            postfix: ';',
            decorator: 'none',
            extraProperty: 'extra',
            validate: () => [],
            clone: () => new Parameter('name'),
            toString: () => '+ extendedFeature;',
        };

        expect(IsDecoratedFeature(extendedDecoratedFeature)).toBe(true);
    });
});
