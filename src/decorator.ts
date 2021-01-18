import { ResilientCallback, ResilientDelegate, ResilientPolicyOptions } from "./resilient-callback";

export const resilient = <TArgs extends any[] = any[], TResult = any>(options: ResilientPolicyOptions) =>
    (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<ResilientDelegate<TArgs, TResult>>) => {
        Reflect.defineProperty(target, propertyKey, {
            value: ResilientCallback.create<TArgs, TResult>(descriptor.value!, options)
        });
    };
