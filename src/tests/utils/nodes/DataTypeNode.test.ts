import {beforeEach, describe, expect, test} from 'vitest';
import {MockProperty} from './features/mocks/MockProperty.ts';
import {MockOperation} from './features/mocks/MockOperation.ts';
import {DataTypeNode} from '../../../utils/nodes/classifier/DataTypeNode.ts';

describe('UCDE-DataTypeNode', () => {
    let dataTypeNode: DataTypeNode;

    beforeEach(() => {
        dataTypeNode = new DataTypeNode('MyDataType', 10, 20);
    });

    describe('UCDE-DTN-0100-Constructor', () => {
        test('UCDE-DTN-0101 GIVEN valid inputs WHEN creating DataTypeNode THEN properties should be set correctly', () => {
            expect(dataTypeNode.name).toBe('MyDataType');
            expect(dataTypeNode.x).toBe(10);
            expect(dataTypeNode.y).toBe(20);
            expect(dataTypeNode.properties).toEqual([]);
            expect(dataTypeNode.operations).toEqual([]);
            expect(dataTypeNode.isNotShownPropertiesExist).toBe(false);
            expect(dataTypeNode.isNotShownOperationsExist).toBe(false);
            expect(dataTypeNode.header).toBe('DataType');
        });
    });

    describe('UCDE-DTN-0200-clone', () => {
        test('UCDE-DTN-0201 GIVEN valid DataTypeNode WHEN clone() THEN return a new instance with same values', () => {
            dataTypeNode.properties.push(new MockProperty('prop1'));
            dataTypeNode.operations.push(new MockOperation('op1'));

            const clone = dataTypeNode.clone();
            expect(clone).not.toBe(dataTypeNode); // Ensure it's a new instance
            expect(clone.name).toBe(dataTypeNode.name);
            expect(clone.x).toBe(dataTypeNode.x);
            expect(clone.y).toBe(dataTypeNode.y);
            expect(clone.properties.length).toBe(1);
            expect(clone.operations.length).toBe(1);
        });
    });

    describe('UCDE-DTN-0300-copy', () => {
        test('UCDE-DTN-0301 GIVEN another DataTypeNode WHEN copy() THEN copy values correctly', () => {
            const anotherNode = new DataTypeNode('AnotherDataType', 30, 40, [new MockProperty('prop2')], [new MockOperation('op2')]);
            dataTypeNode.copy(anotherNode);
            expect(dataTypeNode.name).toBe('AnotherDataType');
            expect(dataTypeNode.x).toBe(30);
            expect(dataTypeNode.y).toBe(40);
            expect(dataTypeNode.properties.length).toBe(1);
            expect(dataTypeNode.operations.length).toBe(1);
        });
    });
});