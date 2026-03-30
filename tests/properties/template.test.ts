import * as fc from 'fast-check';

describe('Property-based Test: Template', () => {
  it('should demonstrate a basic property test', () => {
    // Feature: wikipedia-patrol-tool, Property 0: Example Property
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        return a + b === b + a;
      })
    );
  });
});
