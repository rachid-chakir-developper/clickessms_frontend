import { filterMap } from '../../_shared/tools/functions';
import { Submodule, Module, Page } from './modules';

/**
 * Given a search term, filters the modules to only keep what is relevant in
 * the search. Entries that match the search, whether they are modules,
 * submodules or pages, are marked as highlighted.
 * When a module or submodule matches, all its sub-entries are kept, but are
 * not highlighted (unless they themselves are a match).
 * Modules and submodules that contain a highlighted entry are automatically
 * expanded.
 */
export function filterModulesForSearch(
  modules: Module[],
  term: string,
): ModuleViewModel[] {
  return filterMap(modules, (_module) => {
    const module: ModuleViewModel = { ..._module };
    if (doesStringMatchTerm(module.name, term)) {
      module.highlighted = true;
    }
    const filteredEntries = filterMap(module.entries, (_entry) => {
      let entry: SubmoduleViewModel | PageViewModel = _entry;
      if (doesStringMatchTerm(entry.name, term)) {
        module.expanded = true;
        entry = { ...entry, highlighted: true };
      }
      if ('pages' in entry) {
        const filteredPages = filterMap(entry.pages, (page) => {
          if (doesStringMatchTerm(page.name, term)) {
            module.expanded = true;
            entry.expanded = true;
            return { ...page, highlighted: true };
          }
          return entry.highlighted ? page : undefined;
        });
        if (filteredPages.length > 0) {
          return { ...entry, pages: filteredPages };
        }
      }
      if (module.highlighted || entry.highlighted) {
        return entry;
      }
      return undefined;
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

export interface ModuleViewModel extends Module {
  entries: (SubmoduleViewModel | PageViewModel)[];
  highlighted?: boolean;
  expanded?: boolean;
}

export interface SubmoduleViewModel extends Submodule {
  pages: PageViewModel[];
  highlighted?: boolean;
  expanded?: boolean;
}

export interface PageViewModel extends Page {
  highlighted?: boolean;
}
