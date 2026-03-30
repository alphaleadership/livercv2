import * as fc from 'fast-check';
import { FilterManager } from '@/core/filter-manager';
import { RecentChange } from '@/types/mediawiki-events';
import { FilterCriteria } from '@/types/filters';

describe('FilterManager Property Tests', () => {
  // Générateur pour FilterCriteria
  const criteriaArb = fc.record({
    showIP: fc.boolean(),
    showRegistered: fc.boolean(),
    showBots: fc.boolean(),
    showNewPages: fc.boolean(),
    showEdits: fc.boolean(),
    namespaces: fc.array(fc.integer({ min: 0, max: 100 })),
    whitelist: fc.array(fc.string()),
    blacklist: fc.array(fc.string())
  });

  // Générateur simplifié pour RecentChange
  const recentChangeArb = fc.record({
    type: fc.constantFrom('edit', 'new', 'log', 'categorize'),
    user: fc.string(),
    bot: fc.boolean(),
    namespace: fc.integer({ min: 0, max: 100 }),
    wiki: fc.constant('frwiki')
  }) as fc.Arbitrary<any>;

  it('should always respect whitelist regardless of other filters', () => {
    // Feature: wikipedia-patrol-tool, Property 4: Comprehensive Filtering Consistency
    fc.assert(
      fc.property(criteriaArb, recentChangeArb, (criteria, rc) => {
        const user = rc.user;
        const testCriteria = { ...criteria, whitelist: [user], blacklist: [] };
        const manager = new FilterManager(testCriteria as FilterCriteria);
        
        // Si l'utilisateur est dans la whitelist, shouldShowChange doit toujours être vrai
        return manager.shouldShowChange(rc as RecentChange) === true;
      })
    );
  });

  it('should always respect blacklist (if not in whitelist)', () => {
    fc.assert(
      fc.property(criteriaArb, recentChangeArb, (criteria, rc) => {
        const user = rc.user;
        const testCriteria = { ...criteria, whitelist: [], blacklist: [user] };
        const manager = new FilterManager(testCriteria as FilterCriteria);
        
        // Si l'utilisateur est dans la blacklist, shouldShowChange doit toujours être faux
        return manager.shouldShowChange(rc as RecentChange) === false;
      })
    );
  });
});
