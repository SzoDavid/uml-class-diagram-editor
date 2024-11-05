import {beforeEach, describe, expect, test} from 'vitest';
import {Aggregation} from '../../../../utils/nodes/connection/Aggregation.ts';

describe('UCDE-Aggregation', () => {
    let aggregation: Aggregation;

    beforeEach(() => {
        aggregation = new Aggregation([
            {x: 0, y: 0},
            {x: 0, y: 5},
            {x:5, y: 5}
        ]);
    });

    describe('UCDE-AG-0100-Clone', () => {
        test('UCDE-AG-0101 GIVEN valid aggregation WHEN clone() THEN return a new instance with same values', () => {
            aggregation.startName = 'startName';
            aggregation.isStartShared = true;
            aggregation.endName = 'endName';
            aggregation.isEndShared = false;

            const clone = aggregation.clone();
            expect(clone).not.toBe(aggregation);
            expect(clone.parts).toHaveLength(2);
            expect(clone.parts[0].startPoint.x).toBe(0);
            expect(clone.parts[0].startPoint.y).toBe(0);
            expect(clone.parts[0].endPoint).toBe(clone.parts[1].startPoint);
            expect(clone.startName).toBe('startName');
            expect(clone.isStartShared).toBe(true);
            expect(clone.endName).toBe('endName');
            expect(clone.isEndShared).toBe(false);
        });
    });

    describe('UCDE-AG-0200-Copy', () => {
        test('UCDE-AG-0201 GIVEN another aggregation WHEN copy() THEN copy values correctly', () => {
            const anotherAggregation = new Aggregation([
                {x: 1, y: 1},
                {x: 1, y: 2},
                {x: 2, y: 2},
                {x: 3, y: 3}
            ]);

            anotherAggregation.startName = 'startName';
            anotherAggregation.isStartShared = true;
            anotherAggregation.endName = 'endName';
            anotherAggregation.isEndShared = false;

            aggregation.copy(anotherAggregation);
            expect(aggregation.parts).toHaveLength(3);
            expect(aggregation.parts[0].startPoint.x).toBe(1);
            expect(aggregation.parts[0].startPoint.y).toBe(1);
            expect(aggregation.parts[0].endPoint).toBe(aggregation.parts[1].startPoint);
            expect(aggregation.startName).toBe('startName');
            expect(aggregation.isStartShared).toBe(true);
            expect(aggregation.endName).toBe('endName');
            expect(aggregation.isEndShared).toBe(false);
        });
    });
});