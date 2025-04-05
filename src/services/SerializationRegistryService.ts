import { Serializable } from '../utils/nodes/Serializable.ts';

interface SerializableClass<T, K> {
    new (...args: any[]): T;
    fromSerializable(data: any, previousNodes: K[]): T;
}

export class DeserializationError extends Error {}

const registry = new Map<string, SerializableClass<any, any>>();

export const SerializationRegistryService = {
    register<T extends Serializable>(
        tag: string,
        cls: SerializableClass<T, any>,
    ): void {
        registry.set(tag, cls);
    },

    deserialize<T>(data: any, nodes: T[] = []): T {
        const { tag, ...properties } = data;
        const cls = registry.get(tag);

        if (!cls) {
            throw new Error(`No class registered for tag: ${tag}`);
        }

        return cls.fromSerializable(properties, nodes);
    },

    batchDeserialize<T>(dataList: any[]): T[] {
        const result: T[] = [];
        const waitlist: any[] = [];

        dataList.forEach((data, index) => {
            try {
                result.push(this.deserialize(data, result));
            } catch (e) {
                if (!(e instanceof DeserializationError)) throw e;

                if (index + waitlist.length < dataList.length) {
                    waitlist.push(data);
                } else {
                    throw e;
                }
            }
        });

        // This has to be changed if these references can be circular
        for (const data of waitlist) {
            result.push(this.deserialize(data, result));
        }

        return result;
    },
};
