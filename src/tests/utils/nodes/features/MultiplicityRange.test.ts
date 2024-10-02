import { describe, expect, test } from 'vitest';
import { MultiplicityRange } from '../../../../utils/nodes/features/MultiplicityRange';

describe('UCDE-MultiplicityRange', () => {
    describe('UCDE-MR-0100-toString', () => {
        describe('UCDE-MR-0101 GIVEN valid inputs WHEN toString() THEN return excepted value', () => {
            test.each([
                { lower: 1, upper: 5, expected: '1..5' },
                { lower: null, upper: 5, expected: '5' },
                { lower: null, upper: '*' as const, expected: '*' },
                { lower: null, upper: null, expected: '' }
            ])('UCDE-MR-0101 {lower: $lower, upper: $upper, expected: $expected}', ({lower, upper, expected}) => {
                const range = new MultiplicityRange(upper, lower);
                expect(range.toString()).toBe(expected);
            });
        });
    });

    describe('UCDE-MR-0200-validate', () => {
        describe('UCDE-MR-0201 GIVEN valid inputs WHEN validate() THEN no errors returned', () => {
            test.each([
                { lower: 1, upper: 5 },
                { lower: 0, upper: '*' as const },
                { lower: null, upper: 5 },
                { lower: null, upper: '*' as const },
                { lower: null, upper: null }
            ])('UCDE-MR-0201 {lower: $lower, upper: $upper}', ({lower, upper}) => {
                const range = new MultiplicityRange(upper, lower);
                expect(range.validate()).toEqual([]);
            });
        });

        describe('UCDE-MR-0202 GIVEN invalid upper WHEN validate() THEN return excepted error', () => {
            test.each([
                { upper: 0, expectedErrors: [{parameter: 'upper', message: 'Upper limit must be larger than 0'}] },
                { upper: -1, expectedErrors: [{parameter: 'upper', message: 'Upper limit must be larger than 0'}] },
                { upper: 'invalid', expectedErrors: [{parameter: 'upper', message: 'The only acceptable non-numeric value is "*"'}] }
            ])('UCDE-MR-0202 {upper: $upper, expectedErrors: $expectedErrors}', ({upper, expectedErrors}) => {
                // @ts-expect-error Wrong value is excepted
                const range = new MultiplicityRange(upper);
                expect(range.validate()).toEqual(expectedErrors);
            });
        });

        describe('UCDE-MR-0203 GIVEN invalid lower WHEN validate() THEN return expected error', () => {
            test.each([
                {upper: 5, lower: -1, expectedErrors: [{parameter: 'lower', message: 'Lower limit must be at least 0'}] },
                {upper: 5, lower: 5, expectedErrors: [{ parameter: 'lower', message: 'Lower limit must be less than upper' }] },
                {upper: 5, lower: 6, expectedErrors: [{ parameter: 'lower', message: 'Lower limit must be less than upper' }] },
            ])('UCDE-MR-0203 {upper: $upper, lower: $lower, expectedErrors: $expectedErrors}', ({upper, lower, expectedErrors}) => {
                const range = new MultiplicityRange(upper, lower);
                expect(range.validate()).toEqual(expectedErrors);
            });
        });
    });

    describe('UCDE-MR-0300-clone', () => {
        describe('UCDE-MR-0301 GIVEN valid multiplicity WHEN clone() THEN return new instance with the same values', () => {
            test.each([
                { lower: 1, upper: 5 },
                { lower: 1 , upper: '*' as const}
            ])('UCDE-MR-0301 {upper: $upper, lower: $lower}', ({lower, upper}) => {
                const range = new MultiplicityRange(upper, lower);
                const clone = range.clone();
                expect(clone).toEqual(range);
                expect(clone).not.toBe(range);
            });
        });

        test('UCDE-MR-0301 GIVEN invalid multiplicity WHEN clone() THEN return new instance with null values', () => {
            // @ts-expect-error Wrong value is excepted
            const range = new MultiplicityRange('invalid', 1);
            const clone = range.clone();
            expect(clone).toEqual(new MultiplicityRange(null, null));
        });
    });
});