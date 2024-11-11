import {beforeEach, describe, expect, test, vi} from 'vitest';
import {GeometryUtils} from '../../../../utils/GeometryUtils.ts';
import {EditorConstants} from '../../../../utils/constants.ts';
import {ConnectionPoint} from '../../../../utils/nodes/connection/ConnectionPoint.ts';
import {Generalization} from '../../../../utils/nodes/connection/Generalization.ts';

describe('UCDE-ConnectionPoint', () => {
    let connectionPoint: ConnectionPoint;

    beforeEach(() => {
        const connection = new Generalization([
            {x: 0, y: 0},
            {x: 5, y:5}
        ]);

        connectionPoint = connection.parts[0].endPoint;
    });

    describe('UCDE-CPO-0100-Validate', () => {
        test('UCDE-CPO-0101 GIVEN valid ConnectionPoint WHEN validate() THEN return no validation errors', () => {
            expect(connectionPoint.validate()).toHaveLength(0);
        });
    });

    describe('UCDE-CPO-0200-ContainsDot', () => {
        test('UCDE-CPO-0201 GIVEN valid ConnectionPoint WHEN containsDot() THEN GeometryUtils.isPointWithinRadius is called with the correct parameters', () => {
            vi.spyOn(GeometryUtils, 'isPointWithinRadius');
            connectionPoint.containsDot(4, 4);
            expect(GeometryUtils.isPointWithinRadius).toHaveBeenCalledWith(4, 4, connectionPoint.x, connectionPoint.y, EditorConstants.maxClickDistance);
        });
    });

    describe('UCDE-CPO-0300-isStartPoint', () => {
        test('UCDE-CPO-0301 GIVEN ConnectionPoint that is the first of a connection WHEN isStartPoint THEN return true', () => {
            expect(new Generalization([{x: 0, y: 0}, {x: 5, y:5}]).parts[0].startPoint.isStartPoint).toBe(true);
        });

        test('UCDE-CPO-0302 GIVEN ConnectionPoint that is not the first of a connection WHEN isStartPoint THEN return false', () => {
            expect(connectionPoint.isStartPoint).toBe(false);
        });
    });

    describe('UCDE-CPO-0400-isEndPoint', () => {
        test('UCDE-CPO-0401 GIVEN ConnectionPoint that is the last of a connection WHEN isEndPoint THEN return true', () => {
            expect(connectionPoint.isEndpoint).toBe(true);
        });

        test('UCDE-CPO-0401 GIVEN ConnectionPoint that is not the last of a connection WHEN isEndPoint THEN return false', () => {
            expect(new Generalization([{x: 0, y: 0}, {x: 5, y:5}]).parts[0].startPoint.isEndpoint).toBe(false);
        });
    });
});