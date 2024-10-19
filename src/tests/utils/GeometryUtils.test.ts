import {describe, test, expect} from 'vitest';
import {GeometryUtils} from '../../utils/GeometryUtils.ts';

describe('UCDE-GeometryUtils', () => {
    describe('UCDE-GU-0100-isPointWithinRadius', () => {
        test('UCDE-GU-0101 GIVEN a point inside the radius WHEN isPointWithinRadius is called THEN return true', () => {
            const result = GeometryUtils.isPointWithinRadius(5, 5, 0, 0, 10);
            expect(result).toBe(true);
        });

        test('UCDE-GU-0102 GIVEN a point on the edge of the radius WHEN isPointWithinRadius is called THEN return true', () => {
            const result = GeometryUtils.isPointWithinRadius(10, 0, 0, 0, 10);
            expect(result).toBe(true);
        });

        test('UCDE-GU-0103 GIVEN a point outside the radius WHEN isPointWithinRadius is called THEN return false', () => {
            const result = GeometryUtils.isPointWithinRadius(11, 0, 0, 0, 10);
            expect(result).toBe(false);
        });

        test('UCDE-GU-0104 GIVEN a point far outside the radius WHEN isPointWithinRadius is called THEN return false', () => {
            const result = GeometryUtils.isPointWithinRadius(20, 20, 0, 0, 10);
            expect(result).toBe(false);
        });
    });

    describe('UCDE-GU-0200-isPointOnLine', () => {
        test('UCDE-GU-0201 GIVEN a point on the line within tolerance WHEN isPointOnLine is called THEN return true', () => {
            const result = GeometryUtils.isPointOnLine(1, 1, 0, 0, 2, 2, 0.1);
            expect(result).toBe(true);
        });

        test('UCDE-GU-0202 GIVEN a point very close to the line within tolerance WHEN isPointOnLine is called THEN return true', () => {
            const result = GeometryUtils.isPointOnLine(1, 1.05, 0, 0, 2, 2, 0.1);
            expect(result).toBe(true);
        });

        test('UCDE-GU-0203 GIVEN a point outside the line when isPointOnLine is called THEN return false', () => {
            const result = GeometryUtils.isPointOnLine(1, 2, 0, 0, 2, 2, 0.1);
            expect(result).toBe(false);
        });

        test('UCDE-GU-0204 GIVEN a point on the line but outside the bounding box WHEN isPointOnLine is called THEN return false', () => {
            const result = GeometryUtils.isPointOnLine(3, 3, 0, 0, 2, 2, 0.1);
            expect(result).toBe(false);
        });

        test('UCDE-GU-0205 GIVEN a point on the line at the exact tolerance distance WHEN isPointOnLine is called THEN return true', () => {
            const result = GeometryUtils.isPointOnLine(1, 1.1, 0, 0, 2, 2, 0.1);
            expect(result).toBe(true);
        });

        test('UCDE-GU-0206 GIVEN a point far from the line WHEN isPointOnLine is called THEN return false', () => {
            const result = GeometryUtils.isPointOnLine(1, 2, 0, 0, 2, 2, 0.5);
            expect(result).toBe(false);
        });
    });
});