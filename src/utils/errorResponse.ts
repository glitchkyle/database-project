export class ErrorResponse extends Error {
    statusCode: number;
    data: any[];
    constructor(message: string, statusCode: number, errors: any[] = []) {
        super(message);
        this.statusCode = statusCode;
        this.data = errors;
    }
}
