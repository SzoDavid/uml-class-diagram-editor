import { describe, expect, test } from 'vitest';
import { Parameter } from '../../../../utils/nodes/features/Parameter';
import { MultiplicityRange } from '../../../../utils/nodes/features/MultiplicityRange';
import {Direction, ParameterProperty} from '../../../../utils/nodes/types';

describe('UCDE-Parameter', () => {
    describe('UCDE-P-0100-toString', () => {
        describe('UCDE-P-0101 GIVEN valid inputs WHEN toString() THEN return expected value', () => {
            test.each([
                { direction: 'in' as Direction, name: 'param1', type: 'int', multiplicity: new MultiplicityRange(5, 1), defaultValue: '', properties: [] as ParameterProperty[], expected: 'in param1: int[1..5]' },
                { direction: 'out' as Direction, name: 'param2', type: 'string', multiplicity: new MultiplicityRange(null), defaultValue: 'hello', properties: [] as ParameterProperty[], expected: 'out param2: string = hello' },
                { direction: null, name: 'param3', type: 'bool', multiplicity: new MultiplicityRange('*', null), defaultValue: '', properties: ['ordered'] as ParameterProperty[], expected: 'param3: bool[*] {ordered}' },
                { direction: 'inout' as Direction, name: 'param4', type: 'float', multiplicity: new MultiplicityRange(null), defaultValue: '3.14', properties: ['unique', 'ordered'] as ParameterProperty[], expected: 'inout param4: float = 3.14 {unique,ordered}' }
            ])('UCDE-P-0101 {direction: $direction, name: $name, type: $type, multiplicity: $multiplicity, defaultValue: $defaultValue, properties: $properties}', ({ direction, name, type, multiplicity, defaultValue, properties, expected }) => {
                const param = new Parameter(name, type, direction, multiplicity, defaultValue, properties);
                expect(param.toString()).toBe(expected);
            });
        });
    });

    describe('UCDE-P-0200-validate', () => {
        describe('UCDE-P-0201 GIVEN valid inputs WHEN validate() THEN no errors returned', () => {
            test.each([
                { name: 'param1', type: 'int', direction: 'in' as Direction, multiplicity: new MultiplicityRange(5, 1), defaultValue: 'value', properties: [] as ParameterProperty[] },
                { name: 'param2', type: 'string', direction: null, multiplicity: new MultiplicityRange(null), defaultValue: '', properties: ['unique'] as ParameterProperty[] }
            ])('UCDE-P-0201 {name: $name, type: $type, direction: $direction, multiplicity: $multiplicity}', ({ name, type, direction, multiplicity, defaultValue, properties }) => {
                const param = new Parameter(name, type, direction, multiplicity, defaultValue, properties);
                expect(param.validate()).toEqual([]);
            });
        });

        describe('UCDE-P-0202 GIVEN invalid name WHEN validate() THEN return expected error', () => {
            test.each([
                { name: '', expectedErrors: [{ parameter: 'name', message: 'Name is required' }] },
                { name: 'invalid name!', expectedErrors: [{ parameter: 'name', message: 'Name must be alphanumeric' }] }
            ])('UCDE-P-0202 {name: $name, expectedErrors: $expectedErrors}', ({ name, expectedErrors }) => {
                const param = new Parameter(name, 'int');
                expect(param.validate()).toEqual(expectedErrors);
            });
        });

        test('UCDE-P-0203 GIVEN invalid type WHEN validate() THEN return expected error', () => {
            const param = new Parameter('param1', 'invalid type!');
            expect(param.validate()).toEqual([{ parameter: 'type', message: 'Type must be alphanumeric' }]);
        });

        describe('UCDE-P-0204 GIVEN invalid properties WHEN validate() THEN return expected error', () => {
            test.each([
                { properties: ['unique', 'nonunique'] as ParameterProperty[], expectedErrors: [{ parameter: 'properties', message: 'Property cannot be unique and nonunique in the same time' }] },
                { properties: ['ordered', 'unordered' ] as ParameterProperty[], expectedErrors: [{ parameter: 'properties', message: 'Property cannot be ordered and unordered in the same time' }] }
            ])('UCDE-P-0204 {properties: $properties, expectedErrors: $expectedErrors}', ({ properties, expectedErrors }) => {
                const param = new Parameter('param', 'int', null, new MultiplicityRange(null), '', properties);
                expect(param.validate()).toEqual(expectedErrors);
            });
        });
        
        test('UCDE-P-0205 GIVEN invalid default value WHEN validate() THEN return expected error', () => {
            const param = new Parameter('param', 'int', null, new MultiplicityRange(null), 'invalid value!');
            expect(param.validate()).toEqual([{ parameter: 'defaultValue', message: 'Default value must be alphanumeric' }]);
        });
        
        test('UCDE-P-0206 GIVEN invalid multiplicity WHEN validate() THEN return expected error', () => {
            const param = new Parameter('param', 'int', null, new MultiplicityRange(0));
            expect(param.validate()).toEqual([{parameter: 'multiplicity', message: 'Multiplicity is invalid', context: [{parameter: 'upper', message: 'Upper limit must be larger than 0'}]}]);
        });
    });

    describe('UCDE-P-0300-clone', () => {
        describe('UCDE-P-0301 GIVEN valid parameter WHEN clone() THEN return new instance with same values', () => {
            test.each([
                { name: 'param1', type: 'int', direction: 'in' as Direction, multiplicity: new MultiplicityRange(5, 1), defaultValue: '', properties: [] as ParameterProperty[] },
                { name: 'param2', type: 'string', direction: 'out' as Direction, multiplicity: new MultiplicityRange('*', null), defaultValue: 'default', properties: ['unique'] as ParameterProperty[] }
            ])('UCDE-PARAM-0300 {name: $name, type: $type}', ({ name, type, direction, multiplicity, defaultValue, properties }) => {
                const param = new Parameter(name, type, direction, multiplicity, defaultValue, properties);
                const clone = param.clone();
                expect(clone).toEqual(param);
                expect(clone).not.toBe(param);
            });
        });
    });
});
