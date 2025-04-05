import { beforeEach, describe, expect, test } from 'vitest';
import { Realization } from '../../../../utils/nodes/connection/Realization.ts';

describe('UCDE-Realization', () => {
    let realization: Realization;

    beforeEach(() => {
        realization = new Realization([
            { x: 0, y: 0 },
            { x: 0, y: 5 },
            { x: 5, y: 5 },
        ]);
    });

    describe('UCDE-R-0100-Clone', () => {
        test('UCDE-R-0101 GIVEN valid realization WHEN clone() THEN return a new instance with same values', () => {
            realization.reversed = true;

            const clone = realization.clone();
            expect(clone).not.toBe(realization);
            expect(clone.parts).toHaveLength(2);
            expect(clone.parts[0].startPoint.x).toBe(0);
            expect(clone.parts[0].startPoint.y).toBe(0);
            expect(clone.parts[0].endPoint).toBe(clone.parts[1].startPoint);
            expect(clone.reversed).toBe(true);
        });
    });
});
