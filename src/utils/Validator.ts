export class Validator {
    public static isAlphanumeric(value: string): boolean {
        return /^[a-zA-Z0-9]+$/.test(value);
    }

    public static isOnlyLetters(value: string): boolean {
        return /^[a-zA-Z]+$/.test(value);
    }
}