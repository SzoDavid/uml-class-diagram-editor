import {beforeEach, describe, expect, test} from 'vitest';
import {Connection} from '../../../../utils/nodes/connection/Connection.ts';
import {ConnectionPoint} from '../../../../utils/nodes/connection/ConnectionPoint.ts';

describe('UCDE-Connection', () => {
    let connection: Connection;
    
    beforeEach(() => {
        connection = new Connection([
            new ConnectionPoint(0, 0), 
            new ConnectionPoint(0, 5), 
            new ConnectionPoint(5, 5)
        ]); 
    });
    
    describe('UCDE-C-0100-Constructor', () => {
        test('UCDE-C-0101 GIVEN valid inputs WHEN creating Connection THEN properties should be set correctly', () => {
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

    describe('UCDE-C-0300-Clone', () => {
        test('UCDE-C-0301 GIVEN valid connection WHEN clone() THEN return a new instance with same values', () => {
            const clone = connection.clone();
            expect(clone).not.toBe(connection);
            expect(clone.parts).toHaveLength(2);
            expect(clone.parts[0].startPoint.x).toBe(0);
            expect(clone.parts[0].startPoint.y).toBe(0);
            expect(clone.parts[0].endPoint).toBe(clone.parts[1].startPoint);
        });
    });

    describe('UCDE-C-0400-Copy', () => {
        test('UCDE-C-0401 GIVEN another connection WHEN copy() THEN copy values correctly', () => {
            const anotherConnection = new Connection([
                new ConnectionPoint(1, 1),
                new ConnectionPoint(1, 2),
                new ConnectionPoint(2, 2),
                new ConnectionPoint(3, 3)
            ]);

            connection.copy(anotherConnection);
            expect(connection.parts).toHaveLength(3);
            expect(connection.parts[0].startPoint.x).toBe(1);
            expect(connection.parts[0].startPoint.y).toBe(1);
            expect(connection.parts[0].endPoint).toBe(connection.parts[1].startPoint);
        });
    });
    
    describe('UCDE-C-0500-ContainsDot', () => {
        test('UCDE-C-0501 GIVEN point on connection WHEN containsDot() is called THEN return true', () => {
            expect(connection.containsDot(0, 2)).toBe(true);
        });

        test('UCDE-C-0502 GIVEN point not on connection WHEN containsDot() is called THEN return false', () => {
            expect(connection.containsDot(10, 10)).toBe(false);
        });
    });

    describe('UCDE-C-0600-deselect', () => {
        test('UCDE-C-0601 GIVEN connection with selected children WHEN deselect() is called THEN all children is deselected', () => {
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
});