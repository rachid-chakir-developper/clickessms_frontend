import { Category, Module, Page } from './navigation';

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
      let entry: HighlightableCategory | HighlightablePage = _entry;
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

function normalizeString(str: string): string {
  return removeAccents(str.toString().trim().toLowerCase());
}

function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function filterMap<T>(array: T[], fn: (item: T) => T | undefined): T[] {
  const result: T[] = [];
  for (const item of array) {
    const mapped = fn(item);
    if (mapped !== undefined) {
      result.push(mapped);
    }
  }
  return result;
}

export interface HighlightableModule extends Module {
  entries: (HighlightableCategory | HighlightablePage)[];
  highlighted?: boolean;
}

export interface HighlightableCategory extends Category {
  pages: HighlightablePage[];
  highlighted?: boolean;
}

export interface HighlightablePage extends Page {
  highlighted?: boolean;
}
