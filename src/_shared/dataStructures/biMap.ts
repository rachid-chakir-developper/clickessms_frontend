// Holds the map to inverse while constructing it.
// This is trick: we cannot use the normal constructor when building the inverse
// BiMap, as this would cause an infinite call loop. We cannot bypass the
// constructor either because we need to set private properties.
// We rely on the fact that JS is single-threaded to synchronize the calls with
// the following global variable.
let constructingInverseBiMap: BiMap<any, any> | undefined = undefined;

/**
 * A Map that is indexed both ways.
 * Useful for 1:1 relationships.
 */
export class BiMap<K, V> implements Map<K, V> {
	#forwardMap: Map<K, V>;
	#backwardMap: Map<V, K>;
	#inverse: BiMap<V, K>;

	get inverse(): BiMap<V, K> {
		return this.#inverse;
	}

	constructor(entries?: (readonly [K, V])[] | null) {
		if (constructingInverseBiMap === undefined) {
			const forwardMap = new Map<K, V>();
			const backwardMap = new Map<V, K>();
			this.#forwardMap = forwardMap;
			this.#backwardMap = backwardMap;

			// eslint-disable-next-line @typescript-eslint/no-this-alias
			constructingInverseBiMap = this;
			this.#inverse = new BiMap<V, K>();
			constructingInverseBiMap = undefined;

			if (entries) {
				for (const [key, value] of entries) {
					this.set(key, value);
				}
			}
		} else {
			this.#forwardMap = constructingInverseBiMap.#backwardMap;
			this.#backwardMap = constructingInverseBiMap.#forwardMap;
			this.#inverse = constructingInverseBiMap;
		}
	}

	clear(): void {
		this.#forwardMap.clear();
		this.#backwardMap.clear();
	}

	delete(key: K): boolean {
		if (!this.#forwardMap.has(key)) {
			return false;
		}
		const value = this.#forwardMap.get(key);
		this.#backwardMap.delete(value as V);
		return this.#forwardMap.delete(key);
	}

	forEach(
		callbackfn: (value: V, key: K, map: BiMap<K, V>) => void,
		thisArg?: any
	): void {
		for (const [key, value] of this.#forwardMap) {
			callbackfn.call(thisArg, value, key, this);
		}
	}

	get(key: K): V | undefined {
		return this.#forwardMap.get(key);
	}

	has(key: K): boolean {
		return this.#forwardMap.has(key);
	}

	set(key: K, value: V): this {
		if (this.#forwardMap.has(key)) {
			this.#backwardMap.delete(this.#forwardMap.get(key) as V);
		}
		if (this.#backwardMap.has(value)) {
			this.#forwardMap.delete(this.#backwardMap.get(value) as K);
		}
		this.#forwardMap.set(key, value);
		this.#backwardMap.set(value, key);
		return this;
	}

	// An alternative implementation of set that throws
	// in case a relationship is overridden
	safeSet(key: K, value: V): this {
		if (this.#forwardMap.has(key)) {
			throw new BiMapKeyAlreadySetError(key, value);
		}
		if (this.#backwardMap.has(value)) {
			throw new BiMapValueAlreadyBoundError(key, value);
		}
		this.#forwardMap.set(key, value);
		this.#backwardMap.set(value, key);
		return this;
	}

	entries(): IterableIterator<[K, V]> {
		return this.#forwardMap.entries();
	}

	keys(): IterableIterator<K> {
		return this.#forwardMap.keys();
	}

	values(): IterableIterator<V> {
		return this.#forwardMap.values();
	}

	get size(): number {
		return this.#forwardMap.size;
	}

	[Symbol.iterator](): IterableIterator<[K, V]> {
		return this.#forwardMap[Symbol.iterator]();
	}

	readonly [Symbol.toStringTag] = 'BiMap';
}

export class BiMapKeyAlreadySetError extends Error {
	key: unknown;
	value: unknown;

	constructor(key: unknown, value: unknown) {
		super('Tried to set a key that was already set');
		this.key = key;
		this.value = value;
	}
}

export class BiMapValueAlreadyBoundError extends Error {
	key: unknown;
	value: unknown;

	constructor(key: unknown, value: unknown) {
		super(
			'Tried to set a key with a value that was already bound to another key'
		);

		this.key = key;
		this.value = value;
	}
}
