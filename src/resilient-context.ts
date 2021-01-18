import { Disposable, IDisposable } from "@aster-js/core";
import { AbortableToken, AbortToken } from "@aster-js/async";

export class ResilientContext extends Disposable {
    private readonly _token: AbortableToken;
    private _lastError?: any;
    private _startTime: number;
    private _retryCount: number = -1;
    private _retryStartTime: number = 0;
    private _lastElapsedTime: number = 0;

    get startTime(): number { return this._startTime; }

    get lastError(): any { return this._lastError; }

    get token(): AbortToken { return this._token.readOnly; }

    get lastElapsedTime(): number { return this._lastElapsedTime; }

    get retryCount(): number { return Math.max(this._retryCount, 0); }

    constructor(token: AbortToken) {
        super();
        this._startTime = Date.now();
        this._token = AbortToken.create(token);
    }

    attempt(): void {
        this._retryCount++;
        this._retryStartTime = Date.now();
    }

    onAttemptFail(error: Error): void {
        this._lastError = error;
        this._lastElapsedTime = Date.now() - this._retryStartTime;
    }

    protected dispose(): void {
        IDisposable.safeDispose(this._token);
    }
}
