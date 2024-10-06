import {beforeEach, describe, expect, test} from 'vitest';
import {validateStringKeys} from '../../helpers.ts';
import {EnumerationNode} from '../../../utils/nodes/EnumerationNode.ts';

describe('UCDE-EnumerationNode', () => {
    let enumNode: EnumerationNode;

    beforeEach(() => {
        enumNode = new EnumerationNode('MyEnum', 10, 20);
    });

    describe('UCDE-EN-0100-Constructor', () => {
        test('UCDE-EN-0101 GIVEN valid inputs WHEN creating EnumerationNode THEN properties should be set correctly', () => {
            expect(enumNode.name).toBe('MyEnum');
            expect(enumNode.x).toBe(10);
            expect(enumNode.y).toBe(20);
            expect(enumNode.values).toHaveLength(0);
        });
    });

    describe('UCDE-EN-0200-clone', () => {
        test('UCDE-EN-0201 GIVEN valid EnumerationNode WHEN clone() THEN return a new instance with same values', () => {
            const clone = enumNode.clone();
            expect(clone).not.toBe(enumNode); // Ensure it's a new instance
            expect(clone.name).toBe(enumNode.name);
            expect(clone.x).toBe(enumNode.x);
            expect(clone.y).toBe(enumNode.y);
            expect(clone.values).toEqual(enumNode.values);
        });
    });

    describe('UCDE-EN-0300-copy', () => {
        test('UCDE-EN-0301 GIVEN another EnumerationNode WHEN copy() THEN copy values correctly', () => {
            const anotherNode = new EnumerationNode('AnotherNode', 30, 40, ['value1', 'value2']);
            enumNode.copy(anotherNode);
            expect(enumNode.name).toBe('AnotherNode');
            expect(enumNode.x).toBe(30);
            expect(enumNode.y).toBe(40);
            expect(enumNode.values).toEqual(anotherNode.values);
        });
    });

    describe('UCDE-EN-0400-validate', () => {
        test('UCDE-EN-0401 GIVEN valid EnumerationNode WHEN validate() THEN no validation error should be returned', () => {
            enumNode.values = ['valid1', 'valid2'];
            expect(enumNode.validate()).toHaveLength(0);
        });

        describe('UCDE-EN-0402 GIVEN invalid name WHEN validate() THEN expected valid error should be returned', () => {
            test.each([
                { name: '', expectedErrors: [{parameter: 'name', message: 'error.name.required' }]},
                { name: 'Invalid name!', expectedErrors: [{parameter: 'name', message: 'error.name.alphanumeric' }]}
            ])('UCDE-PTN-0402 {name: $name}', ({ name, expectedErrors }) => {
                expect(validateStringKeys(expectedErrors)).toBe(true);

                enumNode.name = name;
                expect(enumNode.validate()).toEqual(expectedErrors);
            });
        });

        describe('UCDE-EN-0403 GIVEN invalid values WHEN validate() THEN expected valid error should be returned', () => {
            test.each([
                { values: [''], expectedErrors: [{parameter: 'values', index: 0, message: 'error.value.required'}] },
                { values: ['valid', 'Invalid value!'], expectedErrors: [{parameter: 'values', index: 1, message: 'error.value.alphanumeric'}] }
            ])('UCDE-EN-0403 {values: $values}', ({ values, expectedErrors}) => {
                expect(validateStringKeys(expectedErrors)).toBe(true);

                enumNode.values = values;
                expect(enumNode.validate()).toEqual(expectedErrors);
            });
        });
    });
});