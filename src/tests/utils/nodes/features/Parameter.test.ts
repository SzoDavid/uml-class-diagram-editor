import { describe, expect, test } from 'vitest';
import { Parameter } from '../../../../utils/nodes/features/Parameter';
import { MultiplicityRange } from '../../../../utils/nodes/features/MultiplicityRange';
import { Direction, ParameterProperty } from '../../../../utils/nodes/types';
import { validateStringKeys } from '../../../helpers.ts';

describe('UCDE-Parameter', () => {
    describe('UCDE-PA-0100-toString', () => {
        describe('UCDE-PA-0101 GIVEN valid inputs WHEN toString() THEN return expected value', () => {
            test.each([
                {
                    direction: 'in' as Direction,
                    name: 'param1',
                    type: 'int',
                    multiplicity: new MultiplicityRange(5, 1),
                    defaultValue: '',
                    properties: [] as ParameterProperty[],
                    expected: 'in param1: int[1..5]',
                },
                {
                    direction: 'out' as Direction,
                    name: 'param2',
                    type: 'string',
                    multiplicity: new MultiplicityRange(null),
                    defaultValue: 'hello',
                    properties: [] as ParameterProperty[],
                    expected: 'out param2: string = hello',
                },
                {
                    direction: null,
                    name: 'param3',
                    type: 'bool',
                    multiplicity: new MultiplicityRange('*', null),
                    defaultValue: '',
                    properties: ['ordered'] as ParameterProperty[],
                    expected: 'param3: bool[*] {ordered}',
                },
                {
                    direction: 'inout' as Direction,
                    name: 'param4',
                    type: 'float',
                    multiplicity: new MultiplicityRange(null),
                    defaultValue: '3.14',
                    properties: ['unique', 'ordered'] as ParameterProperty[],
                    expected: 'inout param4: float = 3.14 {unique,ordered}',
                },
            ])(
                'UCDE-PA-0101 {direction: $direction, name: $name, type: $type, multiplicity: $multiplicity, defaultValue: $defaultValue, properties: $properties}',
                ({
                    direction,
                    name,
                    type,
                    multiplicity,
                    defaultValue,
                    properties,
                    expected,
                }) => {
                    const param = new Parameter(
                        name,
                        type,
                        direction,
                        multiplicity,
                        defaultValue,
                        properties,
                    );
                    expect(param.toString()).toBe(expected);
                },
            );
        });
    });

    describe('UCDE-PA-0200-validate', () => {
        describe('UCDE-PA-0201 GIVEN valid inputs WHEN validate() THEN no errors returned', () => {
            test.each([
                {
                    name: 'param1',
                    type: 'int',
                    direction: 'in' as Direction,
                    multiplicity: new MultiplicityRange(5, 1),
                    defaultValue: 'value',
                    properties: [] as ParameterProperty[],
                },
                {
                    name: 'param2',
                    type: 'string',
                    direction: null,
                    multiplicity: new MultiplicityRange(null),
                    defaultValue: '',
                    properties: ['unique'] as ParameterProperty[],
                },
            ])(
                'UCDE-PA-0201 {name: $name, type: $type, direction: $direction, multiplicity: $multiplicity}',
                ({
                    name,
                    type,
                    direction,
                    multiplicity,
                    defaultValue,
                    properties,
                }) => {
                    const param = new Parameter(
                        name,
                        type,
                        direction,
                        multiplicity,
                        defaultValue,
                        properties,
                    );
                    expect(param.validate()).toEqual([]);
                },
            );
        });

        describe('UCDE-PA-0202 GIVEN invalid name WHEN validate() THEN return expected valid error', () => {
            test.each([
                {
                    name: '',
                    expectedErrors: [
                        { parameter: 'name', message: 'error.name.required' },
                    ],
                },
                {
                    name: 'invalid name!',
                    expectedErrors: [
                        {
                            parameter: 'name',
                            message: 'error.name.alphanumeric',
                        },
                    ],
                },
            ])(
                'UCDE-PA-0202 {name: $name, expectedErrors: $expectedErrors}',
                ({ name, expectedErrors }) => {
                    expect(validateStringKeys(expectedErrors)).toBe(true);

                    const param = new Parameter(name, 'int');
                    expect(param.validate()).toEqual(expectedErrors);
                },
            );
        });

        describe('UCDE-PA-0203 GIVEN invalid type WHEN validate() THEN return expected valid error', () => {
            test.each([
                {
                    type: 'invalid type!',
                    expectedErrors: [
                        {
                            parameter: 'type',
                            message: 'error.type_alphanumeric',
                        },
                    ],
                },
            ])('UCDE-PA-0203 {type: $type}', ({ type, expectedErrors }) => {
                expect(validateStringKeys(expectedErrors)).toBe(true);

                const param = new Parameter('param', type);
                expect(param.validate()).toEqual(expectedErrors);
            });
        });

        describe('UCDE-PA-0204 GIVEN invalid properties WHEN validate() THEN return expected valid error', () => {
            test.each([
                {
                    properties: ['unique', 'nonunique'] as ParameterProperty[],
                    expectedErrors: [
                        {
                            parameter: 'properties',
                            message: 'error.parameter.unique_nonunique',
                        },
                    ],
                },
                {
                    properties: ['ordered', 'unordered'] as ParameterProperty[],
                    expectedErrors: [
                        {
                            parameter: 'properties',
                            message: 'error.parameter.ordered_unordered',
                        },
                    ],
                },
            ])(
                'UCDE-PA-0204 {properties: $properties}',
                ({ properties, expectedErrors }) => {
                    expect(validateStringKeys(expectedErrors)).toBe(true);

                    const param = new Parameter(
                        'param',
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        properties,
                    );
                    expect(param.validate()).toEqual(expectedErrors);
                },
            );
        });

        describe('UCDE-PA-0205 GIVEN invalid default value WHEN validate() THEN return expected valid error', () => {
            test.each([
                {
                    defaultValue: 'invalid value!',
                    expectedErrors: [
                        {
                            parameter: 'defaultValue',
                            message: 'error.default_value_alphanumeric',
                        },
                    ],
                },
            ])(
                'UCDE-PA-0205 {defaultValue: $defaultValue}',
                ({ defaultValue, expectedErrors }) => {
                    expect(validateStringKeys(expectedErrors)).toBe(true);

                    const param = new Parameter(
                        'param',
                        undefined,
                        undefined,
                        undefined,
                        defaultValue,
                    );
                    expect(param.validate()).toEqual(expectedErrors);
                },
            );
        });

        describe('UCDE-PA-0206 GIVEN invalid multiplicity WHEN validate() THEN return expected error', () => {
            test.each([
                {
                    multiplicityUpper: 0,
                    expectedErrors: [
                        {
                            parameter: 'multiplicity',
                            message: 'error.multiplicity_range.invalid',
                            context: [
                                {
                                    parameter: 'upper',
                                    message:
                                        'error.multiplicity_range.upper_not_larger_than_zero',
                                },
                            ],
                        },
                    ],
                },
            ])(
                'UCDE-PA-0206 {multiplicityUpper: $multiplicityUpper}',
                ({ multiplicityUpper, expectedErrors }) => {
                    expect(validateStringKeys(expectedErrors)).toBe(true);

                    const param = new Parameter(
                        'param',
                        undefined,
                        undefined,
                        new MultiplicityRange(multiplicityUpper),
                    );
                    expect(param.validate()).toEqual(expectedErrors);
                },
            );
        });
    });

    describe('UCDE-PA-0300-clone', () => {
        describe('UCDE-PA-0301 GIVEN valid parameter WHEN clone() THEN return new instance with same values', () => {
            test.each([
                {
                    name: 'param1',
                    type: 'int',
                    direction: 'in' as Direction,
                    multiplicity: new MultiplicityRange(5, 1),
                    defaultValue: '',
                    properties: [] as ParameterProperty[],
                },
                {
                    name: 'param2',
                    type: 'string',
                    direction: 'out' as Direction,
                    multiplicity: new MultiplicityRange('*', null),
                    defaultValue: 'default',
                    properties: ['unique'] as ParameterProperty[],
                },
            ])(
                'UCDE-PARAM-0300 {name: $name, type: $type}',
                ({
                    name,
                    type,
                    direction,
                    multiplicity,
                    defaultValue,
                    properties,
                }) => {
                    const param = new Parameter(
                        name,
                        type,
                        direction,
                        multiplicity,
                        defaultValue,
                        properties,
                    );
                    const clone = param.clone();
                    expect(clone).toEqual(param);
                    expect(clone).not.toBe(param);
                },
            );
        });
    });
});
