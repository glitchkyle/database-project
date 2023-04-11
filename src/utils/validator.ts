import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    isNumber,
    isNumberString,
    isString,
} from "class-validator";

@ValidatorConstraint({ name: "validateStringArray", async: false })
export class ValidateStringArray implements ValidatorConstraintInterface {
    static isValidStringArray(value: unknown[]): boolean {
        for (let i = 0; i < value.length; i++) {
            const str = value[i];
            if (!isString(str)) {
                return false;
            }
        }
        return true;
    }

    static message = "String array must only have valid strings";

    validate(strs: string[]) {
        return ValidateStringArray.isValidStringArray(strs);
    }

    defaultMessage() {
        return ValidateStringArray.message;
    }
}

@ValidatorConstraint({ name: "validateNumericString", async: false })
export class ValidateNumericString implements ValidatorConstraintInterface {
    static isValidNumericString(value: string | number): boolean {
        return isNumber(value) || isNumberString(value);
    }

    static message = "Value must be a number or numeric string";

    validate(value: string | number) {
        return ValidateNumericString.isValidNumericString(value);
    }

    defaultMessage() {
        return ValidateNumericString.message;
    }
}

export function notNull<T>(val: T | null): val is T {
    return val !== null;
}
