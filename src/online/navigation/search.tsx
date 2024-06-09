import { Submodule, Module, Page } from './modules';

/**
 * Given a search term, filter the modules to only keep what is relevant in
 * the search. Entries that match the search, whether they are modules,
 * submodules or pages, are marked as highlighted.
 * When a module or submodule matches, all its sub-entries are kept, but are
 * not highlighted (unless they themselves are a match).
 */
export function filterModules(
  modules: Module[],
  term: string,
): HighlightableModule[] {
  return filterMap(modules, (_module) => {
    let module: HighlightableModule = _module;
    if (doesStringMatchTerm(module.name, term)) {
      module = { ...module, highlighted: true };
    }
    const filteredEntries = filterMap(module.entries, (_entry) => {
      let entry: HighlightableSubmodule | HighlightablePage = _entry;
      if (doesStringMatchTerm(entry.name, term)) {
        entry = { ...entry, highlighted: true };
      }
      if ('pages' in entry) {
        const filteredPages = filterMap(entry.pages, (page) => {
          if (doesStringMatchTerm(page.name, term)) {
            return { ...page, highlighted: true };
          }
          return entry.highlighted ? page : undefined;
        });
        if (filteredPages.length > 0) {
          return { ...entry, pages: filteredPages };
        }
      }
      return module.highlighted || entry.highlighted ? entry : undefined;
    });
    if (filteredEntries.length > 0) {
      return { ...module, entries: filteredEntries };
    }
    return module.highlighted ? module : undefined;
  });
}

function doesStringMatchTerm(str: string, term: string): boolean {
  return normalizeString(str).includes(normalizeString(term));
}

/**
 * Normalizes a string to allow for a lenient comparison. Useful for search.
 * It ignores accents as well as leading and trailing white space.
 */
function normalizeString(str: string): string {
  return removeAccents(str.toString().trim().toLowerCase());
}

function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Combination for a map and a filter. If the function returns undefined, the
 * result is ignored.
 */
function filterMap<I, O>(array: I[], fn: (item: I) => O | undefined): O[] {
  const result: O[] = [];
  for (const item of array) {
    const mapped = fn(item);
    if (mapped !== undefined) {
      result.push(mapped);
    }
  }
  return result;
}

export interface HighlightableModule extends Module {
  entries: (HighlightableSubmodule | HighlightablePage)[];
  highlighted?: boolean;
}

export interface HighlightableSubmodule extends Submodule {
  pages: HighlightablePage[];
  highlighted?: boolean;
}

export interface HighlightablePage extends Page {
  highlighted?: boolean;
}
