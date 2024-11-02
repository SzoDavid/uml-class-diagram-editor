import {beforeEach, describe, expect, test} from 'vitest';
import {Connection} from '../../../../utils/nodes/connection/Connection.ts';
import {Generalization} from '../../../../utils/nodes/connection/Generalization.ts';
import {BasicConnectionPoint, LooseConnectionPoint} from '../../../../utils/nodes/connection/ConnectionPoint.ts';
import {MockPositionalNode} from '../mocks/MockPositionalNode.ts';

describe('UCDE-Connection', () => {
    let connection: Connection;
    
    beforeEach(() => {
        connection = new Generalization([
            {x: 0, y: 0},
            {x: 0, y: 5},
            {x:5, y: 5}
        ]); 
    });
    
    describe('UCDE-G-0100-Constructor', () => {
        test('UCDE-G-0101 GIVEN valid inputs WHEN creating Connection THEN properties should be set correctly', () => {
            expect(connection.parts).toHaveLength(2);
            expect(connection.parts[0].startPoint.x).toBe(0);
            expect(connection.parts[0].startPoint.y).toBe(0);
            expect(connection.parts[0].endPoint).toBe(connection.parts[1].startPoint);
        });
    });

    describe('UCDE-C-0200-Validate', () => {
        test('UCDE-C-0201 GIVEN valid connection WHEN validate() THEN return no validation errors', () => {
            expect(connection.validate()).toHaveLength(0);
        });
    });

    describe('UCDE-C-0300-Copy', () => {
        test('UCDE-C-0301 GIVEN another connection WHEN copy() THEN copy values correctly', () => {
            const anotherConnection = new Generalization([
                {x: 1, y: 1},
                {x: 1, y: 2},
                {x: 2, y: 2},
                {x: 3, y: 3}
            ]);

            connection.copy(anotherConnection);
            expect(connection.parts).toHaveLength(3);
            expect(connection.parts[0].startPoint.x).toBe(1);
            expect(connection.parts[0].startPoint.y).toBe(1);
            expect(connection.parts[0].endPoint).toBe(connection.parts[1].startPoint);
        });
    });
    
    describe('UCDE-C-0400-ContainsDot', () => {
        test('UCDE-C-0401 GIVEN point on connection WHEN containsDot() is called THEN return true', () => {
            expect(connection.containsDot(0, 2)).toBe(true);
        });

        test('UCDE-C-0402 GIVEN point not on connection WHEN containsDot() is called THEN return false', () => {
            expect(connection.containsDot(10, 10)).toBe(false);
        });
    });

    describe('UCDE-C-0500-Deselect', () => {
        test('UCDE-C-0501 GIVEN connection with selected children WHEN deselect() is called THEN all children is deselected', () => {
            connection.isSelected = true;
            connection.parts[0].isSelected = true;
            connection.parts[0].startPoint.isSelected = true;
            connection.parts[1].endPoint.isSelected = true;

            connection.deselect();

            expect(connection.isSelected).toBe(false);

            connection.parts.forEach(part => {
                expect(part.isSelected).toBe(false);
                expect(part.startPoint.isSelected).toBe(false);
                expect(part.endPoint.isSelected).toBe(false);
            });
        });
    });

    describe('UCDE-C-0600-StartPoint', () => {
        test('UCDE-C-0601 GIVEN valid connection WHEN get startPoint THEN the correct point is returned', () => {
            expect(connection.startPoint).toBe(connection.parts[0].startPoint);
            expect(connection.startPoint.x).toBe(0);
            expect(connection.startPoint.y).toBe(0);
        });
    });

    describe('UCDE-C-0700-EndPoint', () => {
        test('UCDE-C-0701 GIVEN valid connection WHEN get endPoint THEN the correct point is returned', () => {
            expect(connection.endPoint).toBe(connection.parts[connection.parts.length - 1].endPoint);
            expect(connection.endPoint.x).toBe(5);
            expect(connection.endPoint.y).toBe(5);
        });
    });

    describe('UCDE-C-0800-ParsePoint', () => {
        test('UCDE-C-0801 GIVEN ConnectionPoint WHEN parsePoint is called THEN return the same ConnectionPoint', () => {
            const point = new BasicConnectionPoint(1, 2, connection);
            const parsedPoint = connection['parsePoint'](point);

            expect(parsedPoint).toBe(point);
        });

        test('UCDE-C-0802 GIVEN PositionalNode WHEN parsePoint is called THEN return LooseConnectionPoint associated with the PositionalNode', () => {
            const positionalNode = new MockPositionalNode(3, 4, 10, 20);
            const parsedPoint = connection['parsePoint'](positionalNode);

            expect(parsedPoint).toBeInstanceOf(LooseConnectionPoint);
            expect((parsedPoint as LooseConnectionPoint).node).toBe(positionalNode);
        });

        test('UCDE-C-0803 GIVEN Point WHEN parsePoint is called THEN return BasicConnectionPoint with Point coordinates', () => {
            const point = {x: 6, y: 7};
            const parsedPoint = connection['parsePoint'](point);

            expect(parsedPoint).toBeInstanceOf(BasicConnectionPoint);
            expect(parsedPoint.x).toBe(point.x);
            expect(parsedPoint.y).toBe(point.y);
        });
    });
});