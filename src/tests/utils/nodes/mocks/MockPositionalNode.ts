import {PositionalNode} from '../../../../utils/nodes/PositionalNode.ts';
import {InvalidNodeParameterCause} from '../../../../utils/nodes/types.ts';

export class MockPositionalNode extends PositionalNode {
    constructor(x: number, y: number, width: number, height: number) {
        super(x, y);
        this.width = width;
        this.height = height;
    }

    clone(): MockPositionalNode {
        return this;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    copy(node: MockPositionalNode): void {
    }

    validate(): InvalidNodeParameterCause[] {
        return [];
    }
}