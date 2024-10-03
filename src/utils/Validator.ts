export class Validator {
    public static isAlphanumeric(value: string): boolean {
        return /^[a-zA-Z0-9_<>]+$/.test(value);
    }
}