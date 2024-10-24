import {describe, test, expect} from 'vitest';
import {GeometryUtils} from '../../utils/GeometryUtils.ts';
import {Point} from '../../utils/types.ts';
import {MockPositionalNode} from './nodes/mocks/MockPositionalNode.ts';

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

        test('UCDE-GU-0207 GIVEN a point within the tolerance on a horizontal line WHEN isPointOnLine is called THEN return true', () => {
            const result = GeometryUtils.isPointOnLine(2, 1, 0, 0, 5, 0, 2);
            expect(result).toBe(true);
        });

        test('UCDE-GU-0208 GIVEN a point within the tolerance on a vertical line WHEN isPointOnLine is called THEN return true', () => {
            const result = GeometryUtils.isPointOnLine(1, 2, 0, 0, 0, 5, 2);
            expect(result).toBe(true);
        });
    });

    describe('UCDE-GU-0300-findIntersectionPoint', () => {
        test('UCDE-GU-0301 GIVEN a point outside the box WHEN findIntersectionPoint is called THEN return the correct intersection point', () => {
            const point: Point = { x: 0, y: 0 };
            const box = new MockPositionalNode(10, 10, 10, 10);
            const result = GeometryUtils.findIntersectionPoint(point, box);
            expect(result).toEqual({ x: 10, y: 10 });
        });

        test('UCDE-GU-0302 GIVEN a point to the left of the box WHEN findIntersectionPoint is called THEN return the left edge intersection point', () => {
            const point: Point = { x: 5, y: 15 };
            const box = new MockPositionalNode(10, 10, 10, 10);
            const result = GeometryUtils.findIntersectionPoint(point, box);
            expect(result).toEqual({ x: 10, y: 15 });
        });

        test('UCDE-GU-0303 GIVEN a point below the box WHEN findIntersectionPoint is called THEN return the bottom edge intersection point', () => {
            const point: Point = { x: 15, y: 25 };
            const box = new MockPositionalNode(10, 10, 10, 10);
            const result = GeometryUtils.findIntersectionPoint(point, box);
            expect(result).toEqual({ x: 15, y: 20 });
        });

        test('UCDE-GU-0304 GIVEN a point at the top right of the box WHEN findIntersectionPoint is called THEN return the top edge intersection point', () => {
            const point: Point = { x: 30, y: 0 };
            const box = new MockPositionalNode(10, 10, 10, 10);
            const result = GeometryUtils.findIntersectionPoint(point, box);
            expect(result).toEqual({ x: 20, y: 10 });
        });

        test('UCDE-GU-0305 GIVEN a point exactly at the center of the box WHEN findIntersectionPoint is called THEN return null', () => {
            const point: Point = { x: 15, y: 15 };
            const box = new MockPositionalNode(10, 10, 10, 10);
            const result = GeometryUtils.findIntersectionPoint(point, box);
            expect(result).toBeNull();
        });
    });
});