import {Point} from './types.ts';
import {PositionalNode} from './nodes/PositionalNode.ts';

export class GeometryUtils {
    static isPointWithinRadius(x: number, y: number, centerX: number, centerY: number, radius: number): boolean {
        return (x >= centerX - radius && x <= centerX + radius &&
            y >= centerY - radius && y <= centerY + radius);
    }

    static isPointOnLine(x: number, y: number, startX: number, startY: number, endX: number, endY: number, tolerance: number): boolean {
        const isVertical = startX === endX;
        const isHorizontal = startY === endY;

        if (isVertical) {
            // Check if the point is within tolerance on the x-axis and within the bounding box of the y-axis
            return Math.abs(x - startX) <= tolerance && y >= Math.min(startY, endY) && y <= Math.max(startY, endY);
        }

        if (isHorizontal) {
            // Check if the point is within tolerance on the y-axis and within the bounding box of the x-axis
            return Math.abs(y - startY) <= tolerance && x >= Math.min(startX, endX) && x <= Math.max(startX, endX);
        }

        const numerator = Math.abs(
            (endY - startY) * x - (endX - startX) * y + endX * startY - endY * startX
        );
        const denominator = Math.sqrt(Math.pow(endY - startY, 2) + Math.pow(endX - startX, 2));
        const distance = numerator / denominator;

        if (distance > tolerance) return false;

        // Check if the point is within the bounding box of the line segment
        return x >= Math.min(startX, endX) && x <= Math.max(startX, endX) &&
            y >= Math.min(startY, endY) && y <= Math.max(startY, endY);
    }

    static findIntersectionPoint(point: Point, node: PositionalNode): Point | null {
        if (point.x >= node.x &&
            point.x <= node.x + node.width &&
            point.y >= node.y &&
            point.y <= node.y + node.height) {
            return null;
        }

        const centerX = node.x + node.width / 2;
        const centerY = node.y + node.height / 2;

        // Parametric line equation: p + t*(center - p)
        const dx = centerX - point.x;
        const dy = centerY - point.y;

        const intersectionPoints: Point[] = [];

        // Left edge (x = box.x)
        const tLeft = (node.x - point.x) / dx;
        const yLeft = point.y + tLeft * dy;
        if (yLeft >= node.y && yLeft <= node.y + node.height) {
            intersectionPoints.push({ x: node.x, y: yLeft });
        }

        // Right edge (x = box.x + box.width)
        const tRight = (node.x + node.width - point.x) / dx;
        const yRight = point.y + tRight * dy;
        if (yRight >= node.y && yRight <= node.y + node.height) {
            intersectionPoints.push({ x: node.x + node.width, y: yRight });
        }

        // Top edge (y = box.y)
        const tTop = (node.y - point.y) / dy;
        const xTop = point.x + tTop * dx;
        if (xTop >= node.x && xTop <= node.x + node.width) {
            intersectionPoints.push({ x: xTop, y: node.y });
        }

        // Bottom edge (y = box.y + box.height)
        const tBottom = (node.y + node.height - point.y) / dy;
        const xBottom = point.x + tBottom * dx;
        if (xBottom >= node.x && xBottom <= node.x + node.width) {
            intersectionPoints.push({ x: xBottom, y: node.y + node.height });
        }

        // Select the closest valid intersection point
        let closestPoint: Point | null = null;
        let minDistance = Infinity;

        intersectionPoints.forEach(intersection => {
            const distance = Math.sqrt((intersection.x - point.x) ** 2 + (intersection.y - point.y) ** 2);
            if (distance < minDistance) {
                minDistance = distance;
                closestPoint = intersection;
            }
        });

        return closestPoint;
    }
}