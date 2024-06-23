import { type ReadonlySetMultiMap, SetMultiMap } from './multiMap';

export interface ReadonlyDirectedGraph<T> {
  /** All the nodes in the graph */
  readonly nodes: ReadonlySet<T>;
  /** Directed edges of the graph; keys are nodes and values are sets of nodes */
  readonly edges: ReadonlySetMultiMap<T, T>;
}

export class DirectedGraph<T> implements ReadonlyDirectedGraph<T> {
  #nodes = new Set<T>();
  #edges = new SetMultiMap<T, T>();

  constructor(edges?: Iterable<[T, T]>) {
    if (edges) {
      for (const [source, destination] of edges) {
        this.addEdge(source, destination);
      }
    }
  }

  get nodes(): ReadonlySet<T> {
    return this.#nodes;
  }

  get edges(): ReadonlySetMultiMap<T, T> {
    return this.#edges;
  }

  /** Adds a node to the graph */
  addNode(node: T): this {
    this.#nodes.add(node);
    return this;
  }

  /** Adds a directed edge to the graph */
  addEdge(source: T, destination: T): this {
    this.#nodes.add(source);
    this.#nodes.add(destination);
    this.#edges.addEntry(source, destination);
    return this;
  }

  deleteNode(node: T): boolean {
    const existed = this.#nodes.delete(node);
    if (existed) {
      this.#edges.delete(node);
    }
    return existed;
  }

  deleteEdge(source: T, destination: T): boolean {
    return this.#edges.deleteEntry(source, destination);
  }
}

export function findCycle<T>(graph: ReadonlyDirectedGraph<T>): T[] | undefined {
  const visited = new Set<T>();
  const stack = new Set<T>();

  function dfs(node: T, path: T[]): T[] | undefined {
    if (stack.has(node)) {
      return path.slice(path.indexOf(node));
    }
    if (visited.has(node)) {
      return undefined;
    }

    visited.add(node);
    stack.add(node);
    path.push(node);

    for (const neighbor of graph.edges.get(node) || []) {
      const cycle = dfs(neighbor, path);
      if (cycle) {
        return cycle;
      }
    }

    stack.delete(node);
    path.pop();
    return undefined;
  }

  for (const node of graph.nodes) {
    if (!visited.has(node)) {
      const path: T[] = [];
      const cycle = dfs(node, path);
      if (cycle) {
        return cycle;
      }
    }
  }

  return undefined;
}

export function* breadthFirstSearch<T>(
  graph: DirectedGraph<T>,
  startNode: T,
): Iterable<T> {
  if (!graph.nodes.has(startNode)) return;

  const queue: T[] = [startNode];
  const visited = new Set<T>([startNode]);

  while (queue.length > 0) {
    const currentNode = queue.shift()!;
    yield currentNode;

    for (const neighbor of graph.edges.get(currentNode) || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}
