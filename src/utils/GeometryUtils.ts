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
}