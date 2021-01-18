## ResilientCallback<TArgs, TResult>

`ResilientCallback` allow to add resiliency over a function call by providing a collection of policies.

```typescript
function getItems(skip: number, take: number): Promise<string[]> {
    const res = fetch(`/items?skip=${skip}&take=${take}`);
    return res.json();
}

const resilientGetItems = ResilientCallback.create(getItems, { waitAndRetry: [100, 500, 1000] });
resilientGetItems(0, 10).then(result => console.warn(result));
```

The callback produced can receive an optional AbortToken:

```typescript
function getItems(skip: number, take: number): Promise<string[]> {
    const res = fetch(`/items?skip=${skip}&take=${take}`);
    return res.json();
}

const resilientGetItems = ResilientCallback.create(getItems, { waitAndRetry: [100, 500, 1000] });
resilientGetItems(0, 10, AbortToken.none).then(result => console.warn(result));
```

If the method already has one, the resiliency will fallback on this token:

```typescript
function getItems(skip: number, take: number, token: AbortToken): Promise<string[]> {
    const res = fetch(`/items?skip=${skip}&take=${take}`, { signal: token.signal() });
    return res.json();
}

const resilientGetItems = ResilientCallback.create(getItems, { waitAndRetry: [100, 500, 1000] });
resilientGetItems(0, 10, AbortToken.none).then(result => console.warn(result));
```

You can also decorate your methods with the `@resilient()` decorator:

```typescript
class MyHttpApi {

    @resilient({ retry: 3 })
    getItems(skip: number, take: number): Promise<string[]> {
        const res = fetch(`/items?skip=${skip}&take=${take}`);
        return res.json();
    }

}
```

