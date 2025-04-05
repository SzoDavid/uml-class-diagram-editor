import { beforeEach, describe, expect, test } from 'vitest';
import { InterfaceNode } from '../../../utils/nodes/classifier/InterfaceNode.ts';
import { MockProperty } from './features/mocks/MockProperty.ts';
import { MockOperation } from './features/mocks/MockOperation.ts';

describe('UCDE-InterfaceNode', () => {
    let interfaceNode: InterfaceNode;

    beforeEach(() => {
        interfaceNode = new InterfaceNode('MyInterface', 10, 20);
    });

    describe('UCDE-IN-0100-Constructor', () => {
        test('UCDE-IN-0101 GIVEN valid inputs WHEN creating InterfaceNode THEN properties should be set correctly', () => {
            expect(interfaceNode.name).toBe('MyInterface');
            expect(interfaceNode.x).toBe(10);
            expect(interfaceNode.y).toBe(20);
            expect(interfaceNode.properties).toEqual([]);
            expect(interfaceNode.operations).toEqual([]);
            expect(interfaceNode.isNotShownPropertiesExist).toBe(false);
            expect(interfaceNode.isNotShownOperationsExist).toBe(false);
            expect(interfaceNode.header).toBe('Interface');
        });
    });

    describe('UCDE-IN-0200-clone', () => {
        test('UCDE-IN-0201 GIVEN valid InterfaceNode WHEN clone() THEN return a new instance with same values', () => {
            interfaceNode.properties.push(new MockProperty('prop1'));
            interfaceNode.operations.push(new MockOperation('op1'));

            const clone = interfaceNode.clone();
            expect(clone).not.toBe(interfaceNode); // Ensure it's a new instance
            expect(clone.name).toBe(interfaceNode.name);
            expect(clone.x).toBe(interfaceNode.x);
            expect(clone.y).toBe(interfaceNode.y);
            expect(clone.properties.length).toBe(1);
            expect(clone.operations.length).toBe(1);
        });
    });

    describe('UCDE-IN-0300-copy', () => {
        test('UCDE-IN-0301 GIVEN another InterfaceNode WHEN copy() THEN copy values correctly', () => {
            const anotherNode = new InterfaceNode(
                'AnotherInterface',
                30,
                40,
                [new MockProperty('prop2')],
                [new MockOperation('op2')],
            );
            interfaceNode.copy(anotherNode);
            expect(interfaceNode.name).toBe('AnotherInterface');
            expect(interfaceNode.x).toBe(30);
            expect(interfaceNode.y).toBe(40);
            expect(interfaceNode.properties.length).toBe(1);
            expect(interfaceNode.operations.length).toBe(1);
        });
    });
});
