import {beforeEach, describe, expect, test, vi} from 'vitest';
import {ConnectionPoint} from '../../../../utils/nodes/connection/ConnectionPoint.ts';
import {GeometryUtils} from '../../../../utils/GeometryUtils.ts';
import {EditorConstants} from '../../../../utils/constants.ts';

describe('UCDE-ConnectionPoint', () => {
    let connectionPoint: ConnectionPoint;

    beforeEach(() => {
        connectionPoint = new ConnectionPoint(5, 5);
    });

    describe('UCDE-CPO-0100-Clone', () => {
        test('UCDE-CPO-0101 GIVEN valid ConnectionPoint WHEN clone() THEN return a new instance with same values', () => {
            const clone = connectionPoint.clone();
            expect(clone).not.toBe(connectionPoint);
            expect(clone.x).toBe(5);
            expect(clone.y).toBe(5);
        });
    });

    describe('UCDE-CPO-0200-Validate', () => {
        test('UCDE-CPO-0201 GIVEN valid ConnectionPoint WHEN validate() THEN return no validation errors', () => {
            expect(connectionPoint.validate()).toHaveLength(0);
        });
    });

    describe('UCDE-CPO-0300-ContainsDot', () => {
        test('UCDE-CPO-0301 GIVEN valid ConnectionPoint WHEN containsDot() THEN GeometryUtils.isPointWithinRadius is called with the correct parameters', () => {
            vi.spyOn(GeometryUtils, 'isPointWithinRadius');
            connectionPoint.containsDot(4, 4);
            expect(GeometryUtils.isPointWithinRadius).toHaveBeenCalledWith(4, 4, connectionPoint.x, connectionPoint.y, EditorConstants.maxClickDistance);
        });
    });
});