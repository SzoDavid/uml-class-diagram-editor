import {Serializable} from '../utils/nodes/Serializable.ts';

type SerializableClass<T, K> = { new (...args: any[]): T; fromSerializable(data: any, previousNodes: K[]): T };

export class DeserializationError extends Error {}

export class SerializationRegistryService {
    private static registry: Map<string, SerializableClass<any, any>> = new Map();

    static register<T extends Serializable>(tag: string, cls: SerializableClass<T, any>):void {
        this.registry.set(tag, cls);
    }

    static deserialize<T>(data: any, nodes: T[] = []): T {
        const { tag, ...properties } = data;
        const cls = this.registry.get(tag);

        if (!cls) {
            throw new Error(`No class registered for tag: ${tag}`);
        }

        return cls.fromSerializable(properties, nodes);
    }

    static batchDeserialize<T>(dataList: any[]): T[] {
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
    }
}

