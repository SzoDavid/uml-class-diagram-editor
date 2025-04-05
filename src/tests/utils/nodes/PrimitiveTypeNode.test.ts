import { beforeEach, describe, expect, test } from 'vitest';
import { PrimitiveTypeNode } from '../../../utils/nodes/PrimitiveTypeNode.ts';
import { validateStringKeys } from '../../helpers.ts';

describe('UCDE-PrimitiveTypeNode', () => {
    let primitiveTypeNode: PrimitiveTypeNode;

    beforeEach(() => {
        primitiveTypeNode = new PrimitiveTypeNode('MyType', 10, 20);
    });

    describe('UCDE-PTN-0100-Constructor', () => {
        test('UCDE-PTN-0101 GIVEN valid inputs WHEN creating PrimitiveTypeNode THEN properties should be set correctly', () => {
            expect(primitiveTypeNode.name).toBe('MyType');
            expect(primitiveTypeNode.x).toBe(10);
            expect(primitiveTypeNode.y).toBe(20);
        });
    });

    describe('UCDE-PTN-0200-clone', () => {
        test('UCDE-PTN-0201 GIVEN valid PrimitiveTypeNode WHEN clone() THEN return a new instance with same values', () => {
            const clone = primitiveTypeNode.clone();
            expect(clone).not.toBe(primitiveTypeNode); // Ensure it's a new instance
            expect(clone.name).toBe(primitiveTypeNode.name);
            expect(clone.x).toBe(primitiveTypeNode.x);
            expect(clone.y).toBe(primitiveTypeNode.y);
        });
    });

    describe('UCDE-PTN-0300-copy', () => {
        test('UCDE-PTN-0301 GIVEN another PrimitiveTypeNode WHEN copy() THEN copy values correctly', () => {
            const anotherNode = new PrimitiveTypeNode('AnotherType', 30, 40);
            primitiveTypeNode.copy(anotherNode);
            expect(primitiveTypeNode.name).toBe('AnotherType');
            expect(primitiveTypeNode.x).toBe(30);
            expect(primitiveTypeNode.y).toBe(40);
        });
    });

    describe('UCDE-PTN-0400-validate', () => {
        test('UCDE-PTN-0401 GIVEN valid PrimitiveTypeNode WHEN validate() THEN no validation error should be returned', () => {
            expect(primitiveTypeNode.validate()).toHaveLength(0);
        });

        describe('UCDE-PTN-0402 GIVEN invalid name WHEN validate() THEN expected valid error should be returned', () => {
            test.each([
                {
                    name: '',
                    expectedErrors: [
                        { parameter: 'name', message: 'error.name.required' },
                    ],
                },
                {
                    name: 'Invalid name!',
                    expectedErrors: [
                        {
                            parameter: 'name',
                            message: 'error.name.alphanumeric',
                        },
                    ],
                },
            ])('UCDE-PTN-0402 {name: $name}', ({ name, expectedErrors }) => {
                expect(validateStringKeys(expectedErrors)).toBe(true);

                primitiveTypeNode.name = name;
                expect(primitiveTypeNode.validate()).toEqual(expectedErrors);
            });
        });
    });
});
