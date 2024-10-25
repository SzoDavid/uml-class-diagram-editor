import {beforeEach, describe, expect, test, vi} from 'vitest';
import {GeometryUtils} from '../../../../utils/GeometryUtils.ts';
import {EditorConstants} from '../../../../utils/constants.ts';
import {Connection} from '../../../../utils/nodes/connection/Connection.ts';
import {ConnectionPoint} from '../../../../utils/nodes/connection/ConnectionPoint.ts';

describe('UCDE-ConnectionPoint', () => {
    let connectionPoint: ConnectionPoint;

    beforeEach(() => {
        const connection = new Connection([
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
});