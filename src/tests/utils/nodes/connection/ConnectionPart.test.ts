import {describe, test, expect, beforeEach} from 'vitest';
import {ConnectionPart} from '../../../../utils/nodes/connection/ConnectionPart.ts';
import {Connection} from '../../../../utils/nodes/connection/Connection.ts';
import {ConnectionPoint} from '../../../../utils/nodes/connection/ConnectionPoint.ts';

describe('UCDE-ConnectionPart', () => {
    let connectionPart: ConnectionPart;

    beforeEach(() => {
        const connection = new Connection([
            new ConnectionPoint(0, 0),
            new ConnectionPoint(0, 4),
            new ConnectionPoint(4, 4)
        ]);

        connectionPart = connection.parts[0];
    });

    describe('UCDE-CPA-0100-Constructor', () => {
        test('UCDE-CPA-0101 GIVEN valid inputs WHEN creating ConnectionPart THEN properties should be set correctly', () => {
            expect(connectionPart.startPoint.x).toBe(0);
            expect(connectionPart.startPoint.y).toBe(0);
            expect(connectionPart.endPoint.x).toBe(0);
            expect(connectionPart.endPoint.y).toBe(4);
        });
    });

    describe('UCDE-CPA-0200-Validate', () => {
        test('UCDE-CPA-0201 GIVEN valid ConnectionPart WHEN validate() THEN return no validation errors', () => {
            expect(connectionPart.validate()).toHaveLength(0);
        });
    });

    describe('UCDE-CPA-0300-Clone', () => {
        test('UCDE-CPA-0301 GIVEN valid ConnectionPart WHEN clone() THEN return a new instance with same values', () => {
            const clone = connectionPart.clone();
            expect(clone).not.toBe(connectionPart);
            expect(clone.startPoint.x).toBe(0);
            expect(clone.startPoint.y).toBe(0);
            expect(clone.endPoint.x).toBe(0);
            expect(clone.endPoint.y).toBe(4);
        });
    });

    describe('UCDE-CPA-0400-Copy', () => {
        test('UCDE-CPA-0401 GIVEN another ConnectionPart WHEN copy() THEN copy values correctly', () => {
            const anotherConnection = new Connection([
                new ConnectionPoint(1, 1),
                new ConnectionPoint(1, 2)
            ]);

            connectionPart.copy(anotherConnection.parts[0]);
            expect(connectionPart.startPoint.x).toBe(1);
            expect(connectionPart.startPoint.y).toBe(1);
            expect(connectionPart.endPoint.x).toBe(1);
            expect(connectionPart.endPoint.y).toBe(2);
        });
    });

    describe('UCDE-CPA-0500-Break', () => {
        test('UCDE-CPA-0501 GIVEN valid ConnectionPart WHEN break() is called THEN parent is modified correctly', () => {
            connectionPart.break();
            expect(connectionPart.parent.parts).toHaveLength(3);

            expect(connectionPart.parent.parts[0].startPoint.x).toBe(0);
            expect(connectionPart.parent.parts[0].startPoint.y).toBe(0);
            expect(connectionPart.parent.parts[0].endPoint.x).toBe(0);
            expect(connectionPart.parent.parts[0].endPoint.y).toBe(2);

            expect(connectionPart.parent.parts[1].startPoint.x).toBe(0);
            expect(connectionPart.parent.parts[1].startPoint.y).toBe(2);
            expect(connectionPart.parent.parts[1].endPoint.x).toBe(0);
            expect(connectionPart.parent.parts[1].endPoint.y).toBe(4);

            expect(connectionPart.parent.parts[2].startPoint.x).toBe(0);
            expect(connectionPart.parent.parts[2].startPoint.y).toBe(4);
            expect(connectionPart.parent.parts[2].endPoint.x).toBe(4);
            expect(connectionPart.parent.parts[2].endPoint.y).toBe(4);
        });
    });
});