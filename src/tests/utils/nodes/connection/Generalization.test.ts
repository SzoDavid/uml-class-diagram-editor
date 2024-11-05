import {beforeEach, describe, expect, test} from 'vitest';
import {Generalization} from '../../../../utils/nodes/connection/Generalization.ts';

describe('UCDE-Generalization', () => {
    let generalization: Generalization;

    beforeEach(() => {
        generalization = new Generalization([
            {x: 0, y: 0},
            {x: 0, y: 5},
            {x:5, y: 5}
        ]);
    });

    describe('UCDE-G-0100-Clone', () => {
        test('UCDE-G-0101 GIVEN valid generalization WHEN clone() THEN return a new instance with same values', () => {
            generalization.reversed = true;

            const clone = generalization.clone();
            expect(clone).not.toBe(generalization);
            expect(clone.parts).toHaveLength(2);
            expect(clone.parts[0].startPoint.x).toBe(0);
            expect(clone.parts[0].startPoint.y).toBe(0);
            expect(clone.parts[0].endPoint).toBe(clone.parts[1].startPoint);
            expect(clone.reversed).toBe(true);
        });
    });
});