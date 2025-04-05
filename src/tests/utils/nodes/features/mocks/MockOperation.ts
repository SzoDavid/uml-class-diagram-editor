import { Operation } from '../../../../../utils/nodes/features/Operation.ts';

export class MockOperation extends Operation {
    constructor(name: string, isAbstract = false) {
        super(
            name,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            isAbstract,
        );
    }

    validate() {
        if (this.name === 'invalid') {
            return [{ parameter: 'name', message: 'Invalid operation name' }];
        }
        return [];
    }

    clone() {
        return new MockOperation(this.name, this.isAbstract);
    }
}
