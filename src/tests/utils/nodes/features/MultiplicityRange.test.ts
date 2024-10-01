import { describe, it, expect } from 'vitest';
import { MultiplicityRange } from '../../../../utils/nodes/features/MultiplicityRange';
import { InvalidNodeParameterCause } from '../../../../utils/nodes/types';

describe('MultiplicityRange', () => {

    describe('toString', () => {
        it('should return correct string representation when both lower and upper are provided', () => {
            const range = new MultiplicityRange(5, 1);
            expect(range.toString()).toBe('1..5');
        });

        it('should return correct string representation when only upper is provided', () => {
            const range = new MultiplicityRange(5);
            expect(range.toString()).toBe('5');
        });

        it('should return "*" when upper is "*"', () => {
            const range = new MultiplicityRange('*');
            expect(range.toString()).toBe('*');
        });

        it('should return null when upper is null', () => {
            const range = new MultiplicityRange(null);
            expect(range.toString()).toBe(null);
        });
    });

    describe('validate', () => {
        it('should return no errors for valid numeric upper and lower limits', () => {
            const range = new MultiplicityRange(5, 1);
            expect(range.validate()).toEqual([]);
        });

        it('should return error for non-numeric upper limit except for "*"', () => {
            // @ts-expect-error Wrong value is excepted
            const range = new MultiplicityRange('invalid');
            const expectedErrors: InvalidNodeParameterCause[] = [
                { parameter: 'upper', message: 'The only acceptable non-numeric value is "*"' }
            ];
            expect(range.validate()).toEqual(expectedErrors);
        });

        it('should return error when upper is less than or equal to 0', () => {
            const range = new MultiplicityRange(0);
            const expectedErrors: InvalidNodeParameterCause[] = [
                { parameter: 'upper', message: 'Upper limit must be larger than 0' }
            ];
            expect(range.validate()).toEqual(expectedErrors);
        });

        it('should return error when lower is less than 0', () => {
            const range = new MultiplicityRange(5, -1);
            const expectedErrors: InvalidNodeParameterCause[] = [
                { parameter: 'lower', message: 'Lower limit must be at least 0' }
            ];
            expect(range.validate()).toEqual(expectedErrors);
        });

        it('should return error when lower is greater than or equal to upper', () => {
            const range = new MultiplicityRange(5, 5);
            const expectedErrors: InvalidNodeParameterCause[] = [
                { parameter: 'lower', message: 'Lower limit must be less than upper' }
            ];
            expect(range.validate()).toEqual(expectedErrors);
        });
    });

    describe('clone', () => {
        it('should return a new instance with the same values', () => {
            const range = new MultiplicityRange(5, 1);
            const clone = range.clone();
            expect(clone).toEqual(range);
            expect(clone).not.toBe(range); // Check that it is a new instance
        });

        it('should return a new instance with null values when upper is invalid', () => {
            // @ts-expect-error Wrong value is excepted
            const range = new MultiplicityRange('invalid', 1);
            const clone = range.clone();
            expect(clone).toEqual(new MultiplicityRange(null, null));
        });

        it('should return a new instance with "*" as upper limit when applicable', () => {
            const range = new MultiplicityRange('*', 1);
            const clone = range.clone();
            expect(clone).toEqual(new MultiplicityRange('*', 1));
        });
    });
});
