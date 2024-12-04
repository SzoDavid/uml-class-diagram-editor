import {Node} from './Node.ts';

export abstract class PositionalNode extends Node {
    NODE_TYPE= 'PositionalNode';

    height: number = 0;
    width: number = 0;

    private _x: number;
    private _y: number;

    protected constructor(x: number, y: number) {
        super();
        this._x = x;
        this._y = y;
    }

    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
    }

    get y(): number {
        return this._y;
    }

    set y(value: number) {
        this._y = value;
    }

    containsDot(x: number, y: number): boolean {
        return x >= this.x &&
        x <= this.x + this.width &&
        y >= this.y &&
        y <= this.y + this.height;
    }
}