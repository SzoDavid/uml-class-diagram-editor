import {Property} from '../../../../../utils/nodes/features/Property.ts';

export class MockProperty extends Property {
    constructor(name: string) {
        super(name, 'string'); // Provide default values for the constructor
    }

    validate() {
        if (this.name === 'invalid') {
            return [{ parameter: 'name', message: 'Invalid property name' }];
        }
        return [];
    }

    clone() {
        return new MockProperty(this.name);
    }
}