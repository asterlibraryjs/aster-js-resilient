import { ResilientContext } from "./resilient-context";

export class ResilienceFailError extends Error {
    constructor(message: string, readonly context: ResilientContext) {
        super(message);
    }
}
