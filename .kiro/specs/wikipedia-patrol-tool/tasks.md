# Implementation Plan: Wikipedia Patrol Tool

## Overview

This implementation plan breaks down the Wikipedia Patrol Tool into discrete, manageable coding tasks that build incrementally toward a complete patrolling application. The approach focuses on establishing core infrastructure first, then building major components, and finally integrating everything into a cohesive system.

## Tasks

- [x] 1. Set up project structure and core infrastructure
  - [x] Create directory structure for modular components
  - [x] Set up build system with webpack/vite for modern JavaScript development
  - [x] Configure testing framework (Jest + fast-check for property-based testing)
  - [x] Create base HTML template with golden-layout integration
  - [x] Set up OAuth configuration for MediaWiki authentication
  - [x] Prepare for hosting on WikiMedia Cloud Services (Toolforge)
  - _Requirements: 9.1, 9.5_

- [ ] 2. Implement core API client and authentication
  - [ ] 2.1 Create MediaWiki API client with OAuth support
    - Implement authentication flow and token management
    - Create base API request/response handling with error management
    - Add support for multiple wiki configurations
    - _Requirements: 9.1, 9.2, 9.5_
  
  - [ ]* 2.2 Write property test for API authentication
    - **Property 20: Authentication State Preservation**
    - **Validates: Requirements 9.4, 9.5**
  
  - [ ] 2.3 Implement ORES client integration
    - Create ORES API client for revision scoring
    - Add batch scoring support for performance
    - _Requirements: 2.3_
  
  - [ ]* 2.4 Write property test for ORES integration
    - **Property 4: Comprehensive Filtering Consistency (ORES component)**
    - **Validates: Requirements 2.3**

- [ ] 3. Build EventStream manager and real-time connectivity
  - [x] 3.1 Create EventStream connection manager
    - [x] Implement WebSocket connection to MediaWiki EventStream
    - [x] Add connection state management (connect, disconnect, pause, resume)
    - [ ] Implement auto-scroll interruption when scrolling down
    - [x] Support multiple wiki monitoring simultaneously
    - _Requirements: 1.1, 1.2, 1.5_
  
  - [ ]* 3.2 Write property test for real-time change processing
    - **Property 1: Real-time Change Processing**
    - **Validates: Requirements 1.2**
  
  - [ ]* 3.3 Write property test for pause/resume functionality
    - **Property 2: Pause and Resume State Consistency**
    - **Validates: Requirements 1.3, 1.4**
  
  - [ ]* 3.4 Write property test for multi-wiki monitoring
    - **Property 3: Multi-wiki Monitoring Capability**
    - **Validates: Requirements 1.5**

- [ ] 4. Checkpoint - Ensure core connectivity works
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement filter management system
  - [x] 5.1 Create filter manager with all criteria types
    - [x] Implement user filters (edit count, account age, user types)
    - [x] Add namespace and ORES score filtering
    - [x] Create whitelist/blacklist functionality with override options
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [x]* 5.2 Write property test for comprehensive filtering
    - **Property 4: Comprehensive Filtering Consistency**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4**
  
  - [x] 5.3 Add filter configuration import/export
    - [x] Support loading filter settings from Wikipedia or external sources
    - [x] Implement configuration persistence across sessions
    - _Requirements: 10.2, 10.3_
  
  - [x]* 5.4 Write property test for configuration persistence
    - **Property 22: Configuration Persistence and Import**
    - **Validates: Requirements 10.2, 10.3, 10.5**

- [x] 6. Build recent changes list component
  - [x] 6.1 Create changes list UI component
    - [x] Implement change display with large click area (click anywhere to open diff)
    - [ ] Add session-specific data: user revert count in session, recent warnings detection
    - [x] Support change status management (reviewed, hidden)
    - [x] Add "Clear List" and "Back" (history) navigation buttons
    - _Requirements: 2.5, 2.6, 6.2_
  
  - [ ]* 6.2 Write property test for change information display
    - **Property 5: Change Information Completeness**
    - **Validates: Requirements 2.5**
  
  - [ ]* 6.3 Write property test for interactive selection
    - **Property 6: Interactive Change Selection**
    - **Validates: Requirements 2.6**
  
  - [ ]* 6.4 Write property test for change status management
    - **Property 14: Change Status Management**
    - **Validates: Requirements 6.2**

- [x] 7. Implement diff preview component
  - [x] 7.1 Create diff display with MediaWiki API integration
    - [x] Fetch and display page revision comparisons
    - [ ] Implement navigation to previous revisions until a "clean" version is found
    - [x] Add "Review" (mark as patrolled) action
    - [x] Implement keyboard navigation between diffs
    - [x] Add image hover preview and text selection web search
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [ ]* 7.2 Write property test for diff display and navigation
    - **Property 9: Diff Display and Navigation Consistency**
    - **Validates: Requirements 4.1, 4.2, 4.5**
  
  - [ ]* 7.3 Write property test for media and text interactions
    - **Property 10: Media and Text Interaction Features**
    - **Validates: Requirements 4.3, 4.4**

- [x] 8. Build user information and action systems
  - [x] 8.1 Create user information manager
    - [x] Implement user data retrieval (info, contributions, blocks)
    - [x] Add IP address tools (Whois, IPQualityScore)
    - [ ] Support user warning detection and hiding (local session)
    - _Requirements: 3.1, 3.2, 3.5_
  
  - [ ]* 8.2 Write property test for user information display
    - **Property 7: User Information Display Completeness**
    - **Validates: Requirements 3.1, 3.2**
  
  - [ ]* 8.3 Write property test for IP tool integration
    - **Property 8: IP Address Tool Integration**
    - **Validates: Requirements 3.5**
  
  - [x] 8.2 Implement action handler for user and page actions
    - [x] Create revert, block, delete, protect functionality
    - [x] Handle differentiation between actual [Admin] actions and [Non-Admin] requests (SI, block request, etc.)
    - [x] Add templated messaging and reason selection (import from WP or custom)
    - [x] Implement permission checking before action execution
    - _Requirements: 6.1, 6.5, 9.2, 5.1, 5.3_
  
  - [ ]* 8.4 Write property test for action execution
    - **Property 13: Action Execution with Permission Validation**
    - **Validates: Requirements 6.1, 6.5**
  
  - [ ]* 8.5 Write property test for permission management
    - **Property 19: Permission Management and Updates**
    - **Validates: Requirements 9.2, 9.3**

- [ ] 9. Checkpoint - Ensure core functionality works
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Implement page management and external integrations
  - [x] 10.1 Create page action handlers
    - [ ] Implement watchlist management with confirmation
    - [ ] Add maintenance banner selection with custom reason field (especially for new pages)
    - [x] Integrate Earwig's copyvio detection tool
    - _Requirements: 5.2, 5.4, 5.5_
  
  - [ ]* 10.2 Write property test for page template selection
    - **Property 11: Page Template Selection Logic**
    - **Validates: Requirements 5.2**
  
  - [ ]* 10.3 Write property test for watchlist and external tools
    - **Property 12: Watchlist and External Tool Integration**
    - **Validates: Requirements 5.4, 5.5**

- [x] 11. Build session management and statistics
  - [x] 11.1 Create session tracker and statistics manager
    - [x] Implement session history tracking for reviewed diffs with access button
    - [x] Add real-time statistics display (reverts, active patrollers using the tool)
    - [x] Create notification system for talk page messages and thanks (visual alerts)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [ ]* 11.2 Write property test for session persistence
    - **Property 16: Session State Persistence**
    - **Validates: Requirements 7.1, 7.4**
  
  - [ ]* 11.3 Write property test for real-time statistics
    - **Property 17: Real-time Statistics and Notifications**
    - **Validates: Requirements 7.2, 7.3, 7.5**

- [x] 12. Implement keyboard navigation and shortcuts
  - [x] 12.1 Create keyboard shortcut system
    - [x] Implement global shortcut handling with context awareness
    - [x] Add navigation shortcuts for changes list and diff view
    - [ ] Support user action shortcuts with customization
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [ ]* 12.2 Write property test for keyboard shortcuts
    - **Property 18: Keyboard Shortcut Consistency**
    - **Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5**

- [ ] 13. Build cross-wiki support and configuration management
  - [ ] 13.1 Implement multi-wiki state management
    - Create separate state containers for each wiki
    - Add wiki switching with configuration isolation
    - Implement wiki-specific action adaptation
    - _Requirements: 10.1, 10.4_
  
  - [ ]* 13.2 Write property test for cross-wiki isolation
    - **Property 21: Cross-wiki Configuration Isolation**
    - **Validates: Requirements 10.1**
  
  - [ ]* 13.3 Write property test for wiki-specific adaptation
    - **Property 23: Wiki-specific Action Adaptation**
    - **Validates: Requirements 10.4**

- [ ] 14. Implement combined actions and advanced features
  - [ ] 14.1 Create combined action coordinator
    - Implement simultaneous revert + messaging functionality in one click
    - Add batch action support for multiple changes
    - Create action templates with reason selection (manual or from WP lists)
    - _Requirements: 6.3, 3.3, 3.4, 5.1, 6.4_
  
  - [ ]* 14.2 Write property test for combined actions
    - **Property 15: Combined Action Coordination**
    - **Validates: Requirements 6.3**

- [ ] 15. Final integration and UI assembly
  - [ ] 15.1 Wire all components together with golden-layout
    - Create main application controller
    - Integrate all components into modular layout system
    - Add component communication and state synchronization
    - Implement error handling and recovery mechanisms
    - _Requirements: All requirements integration_
  
  - [ ] 15.2 Add comprehensive error handling
    - Implement network error recovery with retry logic
    - Add graceful degradation for service failures
    - Create user-friendly error messages and recovery suggestions
    - _Requirements: 9.4, 9.5_

- [ ] 16. Final checkpoint - Complete system testing
  - Ensure all tests pass, ask the user if questions arise.
  - Verify all 23 correctness properties are validated
  - Test complete user workflows end-to-end

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties with minimum 100 iterations
- Unit tests focus on specific examples, edge cases, and integration points
- Checkpoints ensure incremental validation and user feedback opportunities
- All property tests should be tagged with **Feature: wikipedia-patrol-tool, Property {number}: {property_text}**
