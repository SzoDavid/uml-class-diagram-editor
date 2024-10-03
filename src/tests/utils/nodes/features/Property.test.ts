import {describe, expect, test} from 'vitest';
import {Property} from '../../../../utils/nodes/features/Property';
import {MultiplicityRange} from '../../../../utils/nodes/features/MultiplicityRange';
import {PropertyModifier, Visibility} from '../../../../utils/nodes/types';
import {Decorator} from '../../../../utils/nodes/features/DecoratedFeature.ts';
import {validateStringKeys} from '../../../helpers.ts';

describe('UCDE-Property', () => {
    describe('UCDE-P-0100-toString', () => {
        describe('UCDE-P-0101 GIVEN valid inputs WHEN toString() THEN return expected value', () => {
            test.each([
                { name: 'prop1', type: 'int', visibility: Visibility.PUBLIC, isDerived: false, multiplicity: new MultiplicityRange(5, 1), defaultValue: '', isStatic: false, modifiers: [] as PropertyModifier[], redefines: '', subsets: '', expected: '+prop1: int[1..5]' },
                { name: 'prop2', type: 'string', visibility: null, isDerived: true, multiplicity: new MultiplicityRange(null), defaultValue: 'default', isStatic: true, modifiers: [] as PropertyModifier[], redefines: '', subsets: '', expected: '/prop2: string = default' },
                { name: 'prop3', type: '', visibility: Visibility.PRIVATE, isDerived: true, multiplicity: new MultiplicityRange(null), defaultValue: '', isStatic: false, modifiers: ['ordered'] as PropertyModifier[], redefines: 'prop1', subsets: 'subsetProp', expected: '-/prop3 {redefines prop1, subsets subsetProp, ordered}' },
                { name: 'prop4', type: '', visibility: Visibility.PROTECTED, isDerived: false, multiplicity: new MultiplicityRange(null), defaultValue: '', isStatic: false, modifiers: [] as PropertyModifier[], redefines: '', subsets: '', expected: '#prop4' },
                { name: 'prop5', type: '', visibility: Visibility.PACKAGE, isDerived: false, multiplicity: new MultiplicityRange(null), defaultValue: '', isStatic: false, modifiers: [] as PropertyModifier[], redefines: '', subsets: '', expected: '~prop5' }
            ])('UCDE-P-0101 {name: $name, type: $type, visibility: $visibility, modifiers: $modifiers}', ({ name, type, visibility, isDerived, multiplicity, defaultValue, isStatic, modifiers, redefines, subsets, expected }) => {
                const property = new Property(name, type, visibility, isDerived, multiplicity, defaultValue, isStatic, modifiers, redefines, subsets);
                expect(property.toString()).toBe(expected);
            });
        });
    });

    describe('UCDE-P-0200-validate', () => {
        describe('UCDE-P-0201 GIVEN valid inputs WHEN validate() THEN no errors returned', () => {
            test.each([
                { name: 'prop1', type: 'int', visibility: Visibility.PUBLIC, multiplicity: new MultiplicityRange(5, 1), defaultValue: '', modifiers: [] as PropertyModifier[] },
                { name: 'prop2', type: 'string', visibility: null, multiplicity: new MultiplicityRange(null), defaultValue: 'default', modifiers: ['unique'] as PropertyModifier[] }
            ])('UCDE-PR-0201 {name: $name, type: $type}', ({ name, type, visibility, multiplicity, defaultValue, modifiers }) => {
                const property = new Property(name, type, visibility, false, multiplicity, defaultValue, false, modifiers);
                expect(property.validate()).toEqual([]);
            });
        });

        describe('UCDE-P-0202 GIVEN invalid name WHEN validate() THEN return expected valid error', () => {
            test.each([
                { name: '', expectedErrors: [{ parameter: 'name', message: 'error.name.required' }] },
                { name: 'invalid name!', expectedErrors: [{ parameter: 'name', message: 'error.name.alphanumeric' }] }
            ])('UCDE-P-0202 {name: $name, expectedErrors: $expectedErrors}', ({ name, expectedErrors }) => {
                expect(validateStringKeys(expectedErrors)).toBe(true);

                const property = new Property(name, 'int');
                expect(property.validate()).toEqual(expectedErrors);
            });
        });

        describe('UCDE-P-0203 GIVEN invalid type WHEN validate() THEN return expected valid error', () => {
            test.each([
                { type: 'invalid type!', expectedError: [{ parameter: 'type', message: 'error.type_alphanumeric' }]}
            ])('UCDE-P-0203 {type: $type}', ({type, expectedError}) => {
                expect(validateStringKeys(expectedError)).toBe(true);

                const property = new Property('prop1', type);
                expect(property.validate()).toEqual(expectedError);
            });
        });


        describe('UCDE-P-0204 GIVEN invalid defaultValue WHEN validate() THEN return expected valid error', () => {
            test.each([
                { defaultValue: 'invalid value!', expectedErrors: [{ parameter: 'defaultValue', message: 'error.default_value_alphanumeric' }] }
            ])('UCDE-P-0204 {defaultValue: $defaultValue}', ({defaultValue, expectedErrors}) => {
                expect(validateStringKeys(expectedErrors)).toBe(true);

                const property = new Property('prop', undefined, undefined, undefined, undefined, defaultValue);
                expect(property.validate()).toEqual(expectedErrors);
            });
        });


        describe('UCDE-P-0205 GIVEN invalid multiplicity WHEN validate() THEN return expected error', () => {
            test.each([
                { multiplicityUpper: 0, expectedErrors: [{ parameter: 'multiplicity', message: 'error.multiplicity_range.invalid', context:
                            [{ parameter: 'upper', message: 'error.multiplicity_range.upper_not_larger_than_zero' }] }] }
            ])('UCDE-P-0205 {multiplicityUpper: $multiplicityUpper}', ({multiplicityUpper, expectedErrors}) => {
                expect(validateStringKeys(expectedErrors)).toBe(true);

                const property = new Property('prop', undefined, undefined, undefined, new MultiplicityRange(multiplicityUpper));
                expect(property.validate()).toEqual(expectedErrors);
            });
        });

    });

    describe('UCDE-P-0300-clone', () => {
        describe('UCDE-P-0301 GIVEN valid property WHEN clone() THEN return new instance with same values', () => {
            test.each([
                { name: 'prop1', type: 'int', visibility: Visibility.PUBLIC, multiplicity: new MultiplicityRange(5, 1), defaultValue: '', isStatic: false, modifiers: [] as PropertyModifier[] },
                { name: 'prop2', type: 'string', visibility: null, multiplicity: new MultiplicityRange(null, null), defaultValue: 'default', isStatic: true, modifiers: ['union'] as PropertyModifier[] }
            ])('UCDE-P-0300 {name: $name, type: $type}', ({ name, type, visibility, multiplicity, defaultValue, isStatic, modifiers }) => {
                const property = new Property(name, type, visibility, false, multiplicity, defaultValue, isStatic, modifiers);
                const clone = property.clone();
                expect(clone).toEqual(property);
                expect(clone).not.toBe(property);
            });
        });
    });

    describe('UCDE-P-0400-decorator', () => {
        describe('UCDE-P-0401 GIVEN valid property WHEN decorator() THEN return the correct type of decoration', () => {
            test.each([
                { isStatic: true, expectedDecorator: 'underline' as Decorator },
                { isStatic: false, expectedDecorator: 'none' as Decorator }
            ])('UCDE-P-0401 {isStatic: $isStatic, expectedDecorator: $expectedDecorator}', ({ isStatic, expectedDecorator }) => {
                const property = new Property('prop', undefined, undefined, undefined, undefined, undefined, isStatic);
                expect(property.decorator).toEqual(expectedDecorator);
            });
        });
    });

    describe('UCDE-P-0500-prefix', () => {
        describe('UCDE-P-0501 GIVEN valid property WHEN prefix() THEN return the expected value', () => {
            test.each([
                { visibility: Visibility.PUBLIC, isDerived: true, omitVisibility: true, expected: '+/' },
                { visibility: Visibility.PUBLIC, isDerived: false, omitVisibility: true, expected: '+' },
                { visibility: Visibility.PUBLIC, isDerived: false, omitVisibility: false, expected: '' },
                { visibility: Visibility.PUBLIC, isDerived: true, omitVisibility: false, expected: '/' },
                { visibility: Visibility.PACKAGE, isDerived: false, omitVisibility: true, expected: '~' },
                { visibility: Visibility.PRIVATE, isDerived: false, omitVisibility: true, expected: '-' },
                { visibility: Visibility.PROTECTED, isDerived: false, omitVisibility: true, expected: '#' },
            ])('UCDE-P-0501 {visibility: $visibility, isDerived: $isDerived, omitVisibility: $omitVisibility}', ({visibility, isDerived, omitVisibility, expected}) => {
                const property = new Property('prop', undefined, visibility, isDerived);
                property.omitVisibility = omitVisibility;

                expect(property.prefix).toEqual(expected);
            });
        });
    });
});
