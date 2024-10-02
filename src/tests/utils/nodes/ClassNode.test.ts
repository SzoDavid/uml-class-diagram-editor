import { describe, expect, test, beforeEach } from 'vitest';
import {ClassNode} from '../../../utils/nodes/ClassNode.ts';
import {MockOperation} from './features/mocks/MockOperation.ts';
import {MockProperty} from './features/mocks/MockProperty.ts';

describe('UCDE-ClassNode', () => {
    let classNode: ClassNode;

    beforeEach(() => {
        classNode = new ClassNode('MyClass', 10, 20);
    });

    describe('UCDE-CN-0100-Constructor', () => {
        test('UCDE-CN-0101 GIVEN valid inputs WHEN creating ClassNode THEN properties should be set correctly', () => {
            expect(classNode.name).toBe('MyClass');
            expect(classNode.x).toBe(10);
            expect(classNode.y).toBe(20);
            expect(classNode.properties).toEqual([]);
            expect(classNode.operations).toEqual([]);
            expect(classNode.isNotShownPropertiesExist).toBe(false);
            expect(classNode.isNotShownOperationsExist).toBe(false);
            expect(classNode.hasAbstractFlag).toBe(false);
        });
    });

    describe('UCDE-CN-0200-isAbstract', () => {
        test('UCDE-CN-0201 GIVEN hasAbstractFlag is true WHEN checking isAbstract THEN return true', () => {
            classNode.hasAbstractFlag = true;
            expect(classNode.isAbstract).toBe(true);
        });

        test('UCDE-CN-0202 GIVEN an operation with isAbstract true WHEN checking isAbstract THEN return true', () => {
            classNode.operations.push(new MockOperation('operation1', true));
            expect(classNode.isAbstract).toBe(true);
        });

        test('UCDE-CN-0203 GIVEN no abstract flags set WHEN checking isAbstract THEN return false', () => {
            expect(classNode.isAbstract).toBe(false);
        });
    });

    describe('UCDE-CN-0300-validate', () => {
        test('UCDE-CN-0301 GIVEN an empty name WHEN validate() THEN return error for name', () => {
            classNode.name = '';
            expect(classNode.validate()).toEqual([{ parameter: 'name', message: 'Name is required' }]);
        });

        test('UCDE-CN-0302 GIVEN an invalid name WHEN validate() THEN return error for name', () => {
            classNode.name = 'invalid name!';
            expect(classNode.validate()).toEqual([{ parameter: 'name', message: 'Name must be alphanumeric' }]);
        });

        describe('UCDE-CN-0303 GIVEN an invalid property or operation WHEN validate() THEN validate both', () => {
            test.each([
                { property: 'validProperty', operation: 'invalid', expectedErrors: [{
                    parameter: 'operations',
                    index: 0,
                    message: 'Operation is invalid',
                    context: [{ parameter: 'name', message: 'Invalid operation name' }]}] },
                { property: 'invalid', operation: 'validOperation', expectedErrors: [{
                    parameter: 'properties',
                    index: 0,
                    message: 'Property is invalid',
                    context: [{ parameter: 'name', message: 'Invalid property name' }]}] },
                { property: 'invalid', operation: 'invalid', expectedErrors: [
                    {
                        parameter: 'properties',
                        index: 0,
                        message: 'Property is invalid',
                        context: [{ parameter: 'name', message: 'Invalid property name' }]},
                    {
                        parameter: 'operations',
                        index: 0,
                        message: 'Operation is invalid',
                        context: [{ parameter: 'name', message: 'Invalid operation name' }]},
                ]},
            ])('UCDE-CN-0303 {property: $property, operation: $operation}', ({property, operation, expectedErrors})=> {
                classNode.properties.push(new MockProperty(property));
                classNode.operations.push(new MockOperation(operation));
                expect(classNode.validate()).toEqual(expectedErrors);
            });

        });
    });

    describe('UCDE-CN-0400-clone', () => {
        test('UCDE-CN-0401 GIVEN valid ClassNode WHEN clone() THEN return a new instance with same values', () => {
            classNode.properties.push(new MockProperty('prop1'));
            classNode.operations.push(new MockOperation('op1'));
            const clone = classNode.clone();
            expect(clone).not.toBe(classNode); // Ensure it's a new instance
            expect(clone.name).toBe(classNode.name);
            expect(clone.x).toBe(classNode.x);
            expect(clone.y).toBe(classNode.y);
            expect(clone.properties.length).toBe(1);
            expect(clone.operations.length).toBe(1);
        });
    });

    describe('UCDE-CN-0500-copy', () => {
        test('UCDE-CN-0501 GIVEN another ClassNode WHEN copy() THEN copy values correctly', () => {
            const anotherNode = new ClassNode('AnotherClass', 30, 40, [new MockProperty('prop2')], [new MockOperation('op2')]);
            classNode.copy(anotherNode);
            expect(classNode.name).toBe('AnotherClass');
            expect(classNode.x).toBe(30);
            expect(classNode.y).toBe(40);
            expect(classNode.properties.length).toBe(1);
            expect(classNode.operations.length).toBe(1);
        });
    });
});