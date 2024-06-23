# dataStructures

This is an internal library that exposes implementations of abstract data structures.

## Design goals

Data structures defined in the package should respect the following design goals:

- **Idiomatic JavaScript**: Define interfaces that look the most like JavaScript's standard data structures. This has several implications, which are detailed below.
- **Readonly options**: TypeScript standard types include readonly interfaces for each of JavaScript's standard data structures. We do the same.
- **No surprises**: Implement data structures whose behavior and interfaces are widely known, understood and used. Exotic data structures belong to their own packages.
- **Generic interfaces**: Data structures aim for maximum applicability by separating implementations from interfaces, and defining these interfaces with the most generic types.
- **Fully tested and documented**: We write extensive unit tests for each data structure and document each method via `tsdoc` comments.

### How to keep things idiomatic

A generic answer to how to define idiomatic interfaces is impossible. It will boil down to one's own knowledge of the standard APIs and taste for design.
Here is however a non-exhaustive list of obvious implications:

- When defining an operation for a new data structure that also exists in a standard one (like `Map`, `Set` or `Array`), pick the same name; don't use a synonym. For example to retrieve the value associated to a key, call the function `get()` like `Map` does, and not for example `retrieve()`, `entry()` or `lookup()`.
- Data structures are almost always iterables. As such, they should follow the iterator protocol. If there is more than one obvious way of iterating over the data structure, expose alternative iterables through methods (similar to how `Map` can be iterated with `keys()`, `values()` or `entries()`). Although we want functions to be verbs, methods of data structures are an exception because we value following common idioms more than purity.
- Allow for the data structure's constructor to take an iterable as argument. It is consistent with `Map` and `Set` and makes it easier to initialize.
- Although we don't want to use classes for our own abstractions, the standard data structures are classes; therefore, so are the ones in this package.
- Even though we tend to prefer immutability, classic data structures are often not immutable. The performance needs of the caller cannot be known in advance, but if they are reaching for a custom data structure, chances are that it may be for performance reasons. Let them decide whether immutability is valuable for them.
- Provide a value for the property `Symbol.toStringTag`.
- Do not define `toJSON()` in order to make the data structure easily serializable. The native `Set` and `Map` don't do that, so there's no reason for us to do it either.

### How to keep things unsurprising

As with keeping things idiomatic, keeping things unsurprising is a matter of interpretation. Here is however some rules of thumbs:

- If a data structure is not mentioned in Wikipedia, it probably doesn't belong here.
- It is a good idea to checkout data structure libraries from other languages (such as the `collect` package in Guava, or Rust), so as to not reinvent the wheel.
- If you don't have an immediate need for the data structure in the Fabriq codebase, don't implement it.

## FAQ

### What do we mean by "data structures"?

The term "data structures" can mean different things for different people. The expected meaning for this package is the same as in computer science. From Wikipedia:

> In computer science, a data structure is a data organization, management, and storage format that enables efficient access and modification. More precisely, a data structure is a collection of data values, the relationships among them, and the functions or operations that can be applied to the data.

Sometimes, people say "data structures" when they are talking about the data model of their system, i.e. the structure of the domain objects that are manipulated. This package is _unrelated_ to that.
Its purpose it to host abstract implementations. They can therefore be used in a context completely independent from Fabriq.

## Why would we use custom data structures in the first place?

If you limit yourself to using only arrays, objects, maps and sets in your domain logic, chances are that one day you will either:

- Write an algorithm that doesn't perform well because it doesn't layout its data in a way that properly optimizes its access, or
- Write a disguised implementation of a custom data structure in the middle of your domain logic, which violates SOLID principles.

Using the proper data structure improves performance while keeping the code clear (and sometimes even _clearer_ thanks to the separation of concerns).

If you are not already using `Map` and `Set`, convincing you of the relevance of custom data structures is premature. [This article](https://blog.logrocket.com/es6-keyed-collections-maps-and-sets/) is a good place to start.

If you already use `Map` and `Set` routinely, you are in the right tracks! Along with `Array` they should cover almost all of your needs. But in those rare instances where they don't, you need to reach for more powerful tools.

A typical example of a "misuse" of `Map` is when grouping objects. For example, say that you are provided an array of tickets and you want to group them by category. Here would be naïve implementation leveraging `Map` only:

```ts
const ticketsByCategory: Map<Category, Ticket[]> = new Map();
for (const ticket of tickets) {
  let group = ticketsByCategory.get(ticket.category);
  if (group === undefined) {
    group = [];
    ticketsByCategory.set(ticket.category, group);
  }
  group.push(ticket);
}
```

This is fine and works very well, but all that code is not really domain logic, and therefore pollutes the flow.
A good idea to prevent this is to define a generic function (that could be named `groupBy` for example) in order to tuck that code away. This is a good first step, but it only addresses this specific use case and leaks the underlying `Map` type.
A better idea would be to use a data structure tailored to that problem.

Here is the same code leveraging `MultiMap` from `dataStructures`:

```ts
import { ArrayMultiMap } from "libs/dataStructures/_mod.ts";

const ticketsByCategory = new ArrayMultiMap(
  tickets.map((ticket) => [ticket.category, ticket]),
);
```

The code is much shorter but just as efficient. It also better conveys the fundamental relationship between categories and tickets: a multi-map, by definition, associates a key to multiple values.

Now if needed, you have a data structure you can more easily manipulate as it exposes richer primitives than the barebone `Map`.
For example, if you want to iterate over all tickets, you can do `ticketsByCategory.values()`, which is not easily done with the `Map` implementation.
If you want to iterate over all groups, you can do `ticketsByCategory.groups()`, which is as easy as with the `Map` implementation.

### Why do we implement these data structures in-house?

There are only weak reasons for why we prefer an internal package over the direct use of third-party data structure implementations:

- We might not find packages that fit the stated design goals; it would require compromises.
- Using multiple disparate packages for a same set of problems denies developers a cohesive and consistent experience.
- The Deno ecosystem is still small and young; we may not find the appropriate package and, when we do, are not necessarily confident that it will be maintained well.

These reasons only apply for when relying _directly_ on third-party packages.
You are more than welcome, and even encouraged, to include third-party packages as dependencies of `dataStructures` and reexport the implementations (potentially wrapping them in order to make them meet the stated design goals).
Although there is value in controlling the API for the best developer experience, there is little value in reinventing the wheel. Use your best judgment to determine whether a re-implementation is more costly or less costly than relying on a third-party implementation.
