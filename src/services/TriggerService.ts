type Listener<T> = (data: T) => void;

export class TriggerService {
    private triggers = new Map<string, Listener<any>[]>();

    public register<T>(triggerName: string, listener: Listener<T>): void {
        if (!this.triggers.has(triggerName)) {
            this.triggers.set(triggerName, []);
        }
        this.triggers.get(triggerName)?.push(listener);
    }

    public unregister<T>(triggerName: string, listener: Listener<T>): void {
        const listeners = this.triggers.get(triggerName);
        if (listeners) {
            this.triggers.set(
                triggerName,
                listeners.filter((l) => l !== listener),
            );
        }
    }

    public trigger<T>(triggerName: string, data: T): void {
        const listeners = this.triggers.get(triggerName);
        if (listeners) {
            listeners.forEach((listener) => listener(data));
        }
    }
}
