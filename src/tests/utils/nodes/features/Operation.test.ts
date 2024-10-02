import { describe, expect, test } from 'vitest';
import { Operation } from '../../../../utils/nodes/features/Operation';
import { Parameter } from '../../../../utils/nodes/features/Parameter';
import { MultiplicityRange } from '../../../../utils/nodes/features/MultiplicityRange';
import {OperationProperty, Visibility} from '../../../../utils/nodes/types';
import { Decorator } from '../../../../utils/nodes/features/DecoratedFeature.ts';

describe('UCDE-Operation', () => {
    describe('UCDE-O-0100-toString', () => {
        describe('UCDE-O-0101 GIVEN valid inputs WHEN toString() THEN return expected value', () => {
            test.each([
                { name: 'op1', params: [], visibility: Visibility.PUBLIC, returnType: 'string', returnMultiplicity: new MultiplicityRange(1), isStatic: false, isAbstract: false, properties: [] as OperationProperty[], redefines: '', expected: '+op1(): string[1]' },
                { name: 'op2', params: [new Parameter('param1', 'int')], visibility: null, returnType: 'int', returnMultiplicity: new MultiplicityRange(0), isStatic: true, isAbstract: false, properties: [] as OperationProperty[], redefines: '', expected: 'op2(param1: int): int' },
                { name: 'op3', params: [new Parameter('param2', 'string')], visibility: Visibility.PRIVATE, returnType: '', returnMultiplicity: new MultiplicityRange(null), isStatic: false, isAbstract: true, properties: ['unique'] as OperationProperty[], redefines: '', expected: '-op3(param2: string) {abstract, unique}' },
                { name: 'op4', params: [new Parameter('param3', 'boolean')], visibility: Visibility.PROTECTED, returnType: 'string', returnMultiplicity: new MultiplicityRange(1), isStatic: false, isAbstract: false, properties: [] as OperationProperty[], redefines: '', expected: '#op4(param3: boolean): string[1]' },
                { name: 'op5', params: [], visibility: Visibility.PACKAGE, returnType: 'string', returnMultiplicity: new MultiplicityRange(0), isStatic: false, isAbstract: false, properties: ['ordered'] as OperationProperty[], redefines: 'var', expected: '~op5(): string {redefines var, ordered}' }
            ])('UCDE-O-0101 {name: $name}', ({ name, params, visibility, returnType, returnMultiplicity, isStatic, isAbstract, properties, redefines, expected }) => {
                const operation = new Operation(name, params, visibility, returnType, returnMultiplicity, isStatic, isAbstract, properties, redefines);
                expect(operation.toString()).toBe(expected);
            });
        });
    });

    describe('UCDE-O-0200-validate', () => {
        describe('UCDE-O-0201 GIVEN valid inputs WHEN validate() THEN no errors returned', () => {
            test.each([
                { name: 'op1', params: [], visibility: Visibility.PUBLIC, returnType: 'void', returnMultiplicity: new MultiplicityRange(5), properties: ['unique'] as OperationProperty[] },
                { name: 'op2', params: [new Parameter('param1', 'int')], visibility: null, returnType: 'int', returnMultiplicity: new MultiplicityRange('*'), properties: ['ordered'] as OperationProperty[]  }
            ])('UCDE-O-0201 {name: $name}', ({ name, params, visibility, returnType, returnMultiplicity, properties }) => {
                const operation = new Operation(name, params, visibility, returnType, returnMultiplicity, undefined, undefined, properties);
                expect(operation.validate()).toEqual([]);
            });
        });

        describe('UCDE-O-0202 GIVEN invalid name WHEN validate() THEN return expected error', () => {
            test.each([
                { name: '', expectedErrors: [{ parameter: 'name', message: 'Name is required' }] },
                { name: 'invalid name!', expectedErrors: [{ parameter: 'name', message: 'Name must be alphanumeric' }] }
            ])('UCDE-O-0202 {name: $name}', ({ name, expectedErrors }) => {
                const operation = new Operation(name);
                expect(operation.validate()).toEqual(expectedErrors);
            });
        });

        test('UCDE-O-0203 GIVEN invalid return type WHEN validate() THEN return expected error', () => {
            const operation = new Operation('op1', [], null, 'invalid type!');
            expect(operation.validate()).toEqual([{ parameter: 'returnType', message: 'Return type must be alphanumeric' }]);
        });

        test('UCDE-O-0204 GIVEN invalid multiplicity WHEN validate() THEN return expected error', () => {
            const operation = new Operation('op', [], null, 'void', new MultiplicityRange(0));
            expect(operation.validate()).toEqual([{ parameter: 'returnMultiplicity', message: 'Return multiplicity is invalid', context: [{ parameter: 'upper', message: 'Upper limit must be larger than 0' }] }]);
        });

        test('UCDE-O-0205 GIVEN static and abstract true WHEN validate() THEN return expected error', () => {
            const operation = new Operation('op', [], null, 'void', new MultiplicityRange(1), true, true);
            expect(operation.validate()).toEqual([{ parameter: 'isAbstract', message: 'Operation cannot be both static and abstract' }]);
        });

        test('UCDE-O-0206 GIVEN invalid parameters WHEN validate() THEN return expected errors', () => {
            const operation = new Operation('op', [
                new Parameter('', 'int'), // Invalid parameter name
                new Parameter('param2', 'invalid type!') // Invalid type
            ]);
            expect(operation.validate()).toEqual([
                { parameter: 'params', index: 0, message: 'Parameter is invalid', context: [{ parameter: 'name', message: 'Name is required' }] },
                { parameter: 'params', index: 1, message: 'Parameter is invalid', context: [{ parameter: 'type', message: 'Type must be alphanumeric' }] }
            ]);
        });

        describe('UCDE-O-0207 GIVEN unique and ordered properties WHEN multiplicity is null THEN return expected error', () => {
            test.each([
                { props: ['ordered'] as OperationProperty[] },
                { props: ['unique'] as OperationProperty[] },
                { props: ['unique', 'ordered'] as OperationProperty[] },
            ])('UCDE-O-0207 {props: $props}', (({props}) => {
                const operation = new Operation('op', undefined, undefined, undefined, new MultiplicityRange(null), undefined, undefined, props);
                expect(operation.validate()).toEqual([{ parameter: 'properties', message: 'Parameters "unique" and "ordered" requires multiplicity to be set' }]);
            }));

        });
    });

    describe('UCDE-O-0300-clone', () => {
        describe('UCDE-O-0301 GIVEN valid operation WHEN clone() THEN return new instance with same values', () => {
            test.each([
                { name: 'op1', params: [], visibility: Visibility.PUBLIC, returnType: 'void', returnMultiplicity: new MultiplicityRange(1), isStatic: false, isAbstract: false },
                { name: 'op2', params: [new Parameter('param1', 'int')], visibility: null, returnType: 'int', returnMultiplicity: new MultiplicityRange(0), isStatic: true, isAbstract: false }
            ])('UCDE-O-0300 {name: $name}', ({ name, params, visibility, returnType, returnMultiplicity, isStatic, isAbstract }) => {
                const operation = new Operation(name, params, visibility, returnType, returnMultiplicity, isStatic, isAbstract);
                const clone = operation.clone();
                expect(clone).toEqual(operation);
                expect(clone).not.toBe(operation);
            });
        });
    });

    describe('UCDE-O-0400-decorator', () => {
        describe('UCDE-O-0401 GIVEN valid operation WHEN decorator() THEN return the correct type of decoration', () => {
            test.each([
                { isStatic: true, expectedDecorator: 'underline' as Decorator },
                { isStatic: false, expectedDecorator: 'none' as Decorator }
            ])('UCDE-O-0401 {isStatic: $isStatic, expectedDecorator: $expectedDecorator}', ({ isStatic, expectedDecorator }) => {
                const operation = new Operation('op', [], null, 'void', new MultiplicityRange(1), isStatic);
                expect(operation.decorator).toEqual(expectedDecorator);
            });
        });
    });

    describe('UCDE-O-0500-prefix', () => {
        describe('UCDE-O-0501 GIVEN valid operation WHEN prefix() THEN return the expected value', () => {
            test.each([
                { visibility: Visibility.PUBLIC, omitVisibility: true, expected: '+' },
                { visibility: Visibility.PRIVATE, omitVisibility: true, expected: '-' },
                { visibility: Visibility.PROTECTED, omitVisibility: true, expected: '#' },
                { visibility: Visibility.PACKAGE, omitVisibility: true, expected: '~' },
                { visibility: Visibility.PUBLIC, omitVisibility: false, expected: '' }
            ])('UCDE-O-0501 {visibility: $visibility, omitVisibility: $omitVisibility}', ({ visibility, omitVisibility, expected }) => {
                const operation = new Operation('op', [], visibility);
                operation.omitVisibility = omitVisibility;

                expect(operation.prefix).toEqual(expected);
            });
        });
    });

    describe('UCDE-O-0600-toMultilineString', () => {
        describe('UCDE-O-0601 GIVEN valid operation WHEN toMultilineString() THEN return expected value', () => {
            test.each([
                { name: 'op1', params: [new Parameter('param1', 'int')], returnType: 'string', expected: [
                    { text: 'op1(', tabbed: false },
                    { text: 'param1: int', tabbed: true},
                    { text: '): string', tabbed: false}
                ] },
                { name: 'op2', params: [new Parameter('param1', 'int'), new Parameter('param2', 'int')], returnType: undefined, expected: [
                    { text: 'op2(', tabbed: false },
                    { text: 'param1: int,', tabbed: true},
                    { text: 'param2: int', tabbed: true},
                    { text: ')', tabbed: false}
                ] },
                { name: 'op3', params: [], returnType: undefined, expected: [
                    { text: 'op3(', tabbed: false },
                    { text: ')', tabbed: false}
                ] },
            ])('UCDE-O-0601 {name: $name}', ({name, params, returnType, expected}) => {
                const operation = new Operation(name, params, undefined, returnType);
                
                expect(operation.toMultilineString()).toEqual(expected);
            });
        });
    });
});
