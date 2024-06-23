/**
 * A Map that associates keys to multiple values.
 * Readonly.
 */
export interface ReadonlyMultiMap<K, V>
	extends Iterable<[K, V]>,
		IndexedCollection<K, V> {
	readonly size: number;
	has(key: K): boolean;
	get(key: K): Iterable<V>;
	hasEntry(key: K, value: V): boolean;
	forEach(
		callbackfn: (value: V, key: K, map: this) => void,
		thisArg?: any
	): void;
	groups(): IterableIterator<[K, Iterable<V>]>;
}

/**
 * A Map that associates keys to multiple values.
 * Implementations may or may not allow identical values for a given key.
 */
export interface MultiMap<K, V> extends ReadonlyMultiMap<K, V> {
	clear(): void;
	delete(key: K): boolean;
	addEntry(key: K, value: V): this;
	deleteEntry(key: K, value: V): boolean;
}

/**
 * A Map that associates keys to multiple values.
 * Readonly.
 * A key cannot be associated to multiple identical values.
 * Values are stored in a set.
 */
export interface ReadonlySetMultiMap<K, V> extends ReadonlyMultiMap<K, V> {
	get(key: K): ReadonlySet<V>;
	groups(): IterableIterator<[K, ReadonlySet<V>]>;
}

/**
 * A Map that associates keys to multiple values.
 * Readonly.
 * A key can be associated to multiple identical values.
 * Values are stored in an array.
 */
export interface ReadonlyArrayMultiMap<K, V> extends ReadonlyMultiMap<K, V> {
	get(key: K): readonly V[];
	groups(): IterableIterator<[K, readonly V[]]>;
}

/**
 * A Map that associates keys to multiple values.
 * A key can be associated to multiple identical values.
 * Values are stored in an array.
 */
export class ArrayMultiMap<K, V>
	implements ReadonlyArrayMultiMap<K, V>, MultiMap<K, V>
{
	readonly #map: Map<K, V[]>;
	#size: number;

	constructor(entries?: Iterable<[K, V]>) {
		this.#map = new Map();
		this.#size = 0;
		if (entries) {
			for (const [key, value] of entries) {
				this.addEntry(key, value);
			}
		}
	}

	clear(): void {
		this.#size = 0;
		this.#map.clear();
	}

	delete(key: K): boolean {
		return this.#map.delete(key);
	}

	forEach(
		callbackfn: (value: V, key: K, map: this) => void,
		thisArg?: any
	): void {
		for (const [key, value] of this.entries()) {
			callbackfn.call(thisArg, value, key, this);
		}
	}

	get(key: K): readonly V[] {
		return this.#map.get(key) || emptyReadonlyArray;
	}

	has(key: K): boolean {
		return this.#map.has(key);
	}

	hasEntry(key: K, value: V): boolean {
		const array = this.#map.get(key);
		return Boolean(array && array.includes(value));
	}

	addEntry(key: K, value: V): this {
		let array = this.#map.get(key);
		if (!array) {
			array = [];
			this.#map.set(key, array);
		}
		array.push(value);
		++this.#size;
		return this;
	}

	deleteEntry(key: K, value: V): boolean {
		const array = this.#map.get(key);
		if (!array) {
			return false;
		}
		const index = array.indexOf(value);
		if (index === -1) {
			return false;
		}
		array.splice(index, 1);
		--this.#size;
		if (array.length === 0) {
			this.#map.delete(key);
		}
		return true;
	}

	deleteEntries(key: K, value: V): boolean {
		const array = this.#map.get(key);
		if (!array) {
			return false;
		}
		let index = array.indexOf(value);
		if (index === -1) {
			return false;
		}
		while (index !== -1) {
			array.splice(index, 1);
			--this.#size;
			index = array.indexOf(value);
		}
		if (array.length === 0) {
			this.#map.delete(key);
		}
		return true;
	}

	*entries(): IterableIterator<[K, V]> {
		for (const [key, values] of this.#map.entries()) {
			for (const value of values) {
				yield [key, value];
			}
		}
	}

	groups(): IterableIterator<[K, readonly V[]]> {
		return this.#map.entries();
	}

	keys(): IterableIterator<K> {
		return this.#map.keys();
	}

	*values(): IterableIterator<V> {
		for (const values of this.#map.values()) {
			for (const value of values) {
				yield value;
			}
		}
	}

	get size(): number {
		return this.#size;
	}

	[Symbol.iterator](): IterableIterator<[K, V]> {
		return this.entries();
	}

	readonly [Symbol.toStringTag] = 'SetMultiMap';
}

/**
 * A Map that associates keys to multiple values.
 * A key cannot be associated to multiple identical values.
 * Values are stored in a set.
 */
export class SetMultiMap<K, V>
	implements ReadonlySetMultiMap<K, V>, MultiMap<K, V>
{
	readonly #map: Map<K, Set<V>>;
	#size: number;

	constructor(entries?: Iterable<[K, V]>) {
		this.#map = new Map();
		this.#size = 0;
		if (entries) {
			for (const [key, value] of entries) {
				this.addEntry(key, value);
			}
		}
	}

	clear(): void {
		this.#size = 0;
		this.#map.clear();
	}

	delete(key: K): boolean {
		return this.#map.delete(key);
	}

	forEach(
		callbackfn: (value: V, key: K, map: this) => void,
		thisArg?: any
	): void {
		for (const [key, value] of this.entries()) {
			callbackfn.call(thisArg, value, key, this);
		}
	}

	get(key: K): ReadonlySet<V> {
		return this.#map.get(key) || emptyReadonlySet;
	}

	has(key: K): boolean {
		return this.#map.has(key);
	}

	hasEntry(key: K, value: V): boolean {
		const set = this.#map.get(key);
		return Boolean(set && set.has(value));
	}

	addEntry(key: K, value: V): this {
		let set = this.#map.get(key);
		if (set) {
			if (set.has(value)) {
				return this;
			}
		} else {
			set = new Set();
			this.#map.set(key, set);
		}
		set.add(value);
		++this.#size;
		return this;
	}

	deleteEntry(key: K, value: V): boolean {
		const set = this.#map.get(key);
		if (!set) {
			return false;
		}
		const deleted = set.delete(value);
		if (set.size === 0) {
			this.#map.delete(key);
		}
		if (deleted) {
			--this.#size;
		}
		return deleted;
	}

	*entries(): IterableIterator<[K, V]> {
		for (const [key, values] of this.#map.entries()) {
			for (const value of values) {
				yield [key, value];
			}
		}
	}

	groups(): IterableIterator<[K, ReadonlySet<V>]> {
		return this.#map.entries();
	}

	keys(): IterableIterator<K> {
		return this.#map.keys();
	}

	*values(): IterableIterator<V> {
		for (const values of this.#map.values()) {
			for (const value of values) {
				yield value;
			}
		}
	}

	get size(): number {
		return this.#size;
	}

	[Symbol.iterator](): IterableIterator<[K, V]> {
		return this.entries();
	}

	readonly [Symbol.toStringTag] = 'ArrayMultiMap';
}

function createEmptyReadonlySet(): ReadonlySet<any> {
	const emptySet: ReadonlySet<any> = {
		forEach() {},
		has() {
			return false;
		},
		size: 0,
		*entries() {},
		*keys() {},
		*values() {},
		*[Symbol.iterator]() {},
	};
	Object.freeze(emptySet);
	return emptySet;
}

const emptyReadonlySet: ReadonlySet<any> = createEmptyReadonlySet();

const emptyReadonlyArray: readonly any[] = Object.freeze([]);

/**
 * The common interface between Set and Map.
 * Implemented by custom set-like or map-like collections
 * so that their interfaces are consistent
 * with the built-ins Set and Map.
 */
export interface IndexedCollection<K, V> {
	entries(): IterableIterator<[K, V]>;
	keys(): IterableIterator<K>;
	values(): IterableIterator<V>;
}
