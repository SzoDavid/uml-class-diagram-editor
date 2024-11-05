import {beforeEach, describe, expect, test} from 'vitest';
import {Composition} from '../../../../utils/nodes/connection/Composition.ts';

describe('UCDE-Composition', () => {
    let composition: Composition;

    beforeEach(() => {
        composition = new Composition([
            {x: 0, y: 0},
            {x: 0, y: 5},
            {x:5, y: 5}
        ]);
    });

    describe('UCDE-CO-0100-Clone', () => {
        test('UCDE-CO-0101 GIVEN valid composition WHEN clone() THEN return a new instance with same values', () => {
            composition.startName = 'startName';
            composition.endName = 'endName';

            const clone = composition.clone();
            expect(clone).not.toBe(composition);
            expect(clone.parts).toHaveLength(2);
            expect(clone.parts[0].startPoint.x).toBe(0);
            expect(clone.parts[0].startPoint.y).toBe(0);
            expect(clone.parts[0].endPoint).toBe(clone.parts[1].startPoint);
            expect(clone.startName).toBe('startName');
            expect(clone.endName).toBe('endName');
        });
    });

    describe('UCDE-CO-0200-Copy', () => {
        test('UCDE-CO-0201 GIVEN another composition WHEN copy() THEN copy values correctly', () => {
            const anotherComposition = new Composition([
                {x: 1, y: 1},
                {x: 1, y: 2},
                {x: 2, y: 2},
                {x: 3, y: 3}
            ]);

            anotherComposition.startName = 'startName';
            anotherComposition.endName = 'endName';

            composition.copy(anotherComposition);
            expect(composition.parts).toHaveLength(3);
            expect(composition.parts[0].startPoint.x).toBe(1);
            expect(composition.parts[0].startPoint.y).toBe(1);
            expect(composition.parts[0].endPoint).toBe(composition.parts[1].startPoint);
            expect(composition.startName).toBe('startName');
            expect(composition.endName).toBe('endName');
        });
    });
});