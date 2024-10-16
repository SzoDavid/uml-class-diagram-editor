import {Node} from './Node.ts';

export abstract class PositionalNode extends Node {
    height: number = 0;
    width: number = 0;

    x: number;
    y: number;

    protected constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
    }

    containsDot(x: number, y: number): boolean {
        return x >= this.x &&
        x <= this.x + this.width &&
        y >= this.y &&
        y <= this.y + this.height;
    }
}