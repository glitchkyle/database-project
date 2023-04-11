import { ValidationError } from "class-validator";

export class ErrorResponse extends Error {
    statusCode: number;
    data: any[];
    constructor(message: string, statusCode: number, errors: any[] = []) {
        super(message);
        this.statusCode = statusCode;
        this.data = errors;
    }
}

export class ValidationException extends ErrorResponse {
    constructor(public readonly errors: ValidationError[]) {
        super("Validation Failed", 400, errors);
    }
}
