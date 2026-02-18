# Requirements Document

## Introduction

The Wikipedia Patrol Tool is a modern web application designed to replace the outdated LiveRC tool used by French Wikipedia patrollers. The system enables volunteer patrollers to efficiently monitor, filter, and respond to recent changes across Wikipedia and other MediaWiki wikis, helping maintain content quality by identifying and addressing vandalism, mistakes, and policy violations in real-time.

## Glossary

- **Patrol_Tool**: The Wikipedia patrolling web application system
- **EventStream**: MediaWiki's real-time change notification service
- **ORES**: Objective Revision Evaluation Service for automated quality scoring
- **Diff**: A comparison view showing changes between page revisions
- **Patroller**: A volunteer user who monitors and reviews recent changes
- **LiveRC**: The legacy patrolling tool being replaced
- **MediaWiki_API**: The programmatic interface for MediaWiki operations
- **Watchlist**: A user's list of monitored pages
- **Copyvio**: Copyright violation detection
- **Whois**: IP address information lookup service

## Requirements

### Requirement 1: Real-time Change Monitoring

**User Story:** As a patroller, I want to see recent changes in real-time, so that I can quickly identify and respond to potential issues.

#### Acceptance Criteria

1. WHEN the Patrol_Tool starts, THE System SHALL connect to EventStream and display recent changes immediately
2. WHEN new changes occur, THE System SHALL update the changes list without user intervention
3. WHEN a patroller pauses the feed, THE System SHALL stop displaying new changes while maintaining connection
4. WHEN a patroller resumes the feed, THE System SHALL continue displaying new changes from the current time
5. THE System SHALL support monitoring multiple wikis simultaneously

### Requirement 2: Change Filtering and Display

**User Story:** As a patroller, I want to filter changes by various criteria, so that I can focus on the most relevant edits for review.

#### Acceptance Criteria

1. WHEN a patroller sets user criteria filters, THE System SHALL only display changes matching those criteria
2. WHEN a patroller filters by namespace, THE System SHALL show only changes in selected namespaces
3. WHEN a patroller applies ORES score filters, THE System SHALL display only changes within specified score ranges
4. WHEN a patroller uses whitelist/blacklist filters, THE System SHALL exclude or include users and tags accordingly
5. WHEN displaying change lines, THE System SHALL show timestamp, author, page title, edit summary, byte difference, and relevant tags
6. WHEN a change line is clicked, THE System SHALL open a diff preview immediately

### Requirement 3: User Information and Actions

**User Story:** As a patroller, I want to access comprehensive user information and perform moderation actions, so that I can make informed decisions about user behavior.

#### Acceptance Criteria

1. WHEN displaying user information, THE System SHALL show username/IP, status, block history, contribution count, and session statistics
2. WHEN a patroller requests user contributions, THE System SHALL display the user's recent edit history
3. WHEN a patroller initiates a block action, THE System SHALL provide templated reasons and custom input options
4. WHEN a patroller sends user messages, THE System SHALL offer predefined templates with customization capability
5. WHEN dealing with IP addresses, THE System SHALL provide Whois lookup and IP quality assessment tools

### Requirement 4: Diff Preview and Navigation

**User Story:** As a patroller, I want to preview diffs efficiently with keyboard navigation, so that I can quickly review multiple changes.

#### Acceptance Criteria

1. WHEN a diff is displayed, THE System SHALL show a clear comparison between page versions
2. WHEN a patroller uses keyboard shortcuts, THE System SHALL navigate between diffs without mouse interaction
3. WHEN images are present in diffs, THE System SHALL display them on hover for quick preview
4. WHEN text is selected in diffs, THE System SHALL enable right-click web search functionality
5. WHEN navigating between page versions, THE System SHALL maintain context and allow backward/forward movement

### Requirement 5: Page Management Actions

**User Story:** As a patroller, I want to perform administrative actions on pages, so that I can maintain wiki quality and policy compliance.

#### Acceptance Criteria

1. WHEN a patroller requests page deletion, THE System SHALL provide templated deletion reasons and submit requests appropriately
2. WHEN adding maintenance banners, THE System SHALL offer relevant templates based on page type and issues
3. WHEN requesting page protection, THE System SHALL provide protection level options and justification templates
4. WHEN adding pages to watchlist, THE System SHALL confirm addition and update user's watchlist immediately
5. WHEN checking for copyright violations, THE System SHALL integrate with Earwig's copyvio detection tool

### Requirement 6: Edit Actions and Reversion

**User Story:** As a patroller, I want to undo problematic edits and mark changes as reviewed, so that I can maintain content quality efficiently.

#### Acceptance Criteria

1. WHEN a patroller reverts an edit, THE System SHALL check user permissions and execute the reversion with appropriate edit summary
2. WHEN marking changes as reviewed, THE System SHALL update the change status and optionally hide from view
3. WHEN performing combined actions, THE System SHALL allow simultaneous reversion and user messaging
4. WHEN undoing edits, THE System SHALL provide reason selection from predefined options or custom input
5. WHEN hiding revisions, THE System SHALL submit hide requests with appropriate justification

### Requirement 7: Session Management and Statistics

**User Story:** As a patroller, I want to track my session activity and see system statistics, so that I can monitor my productivity and system health.

#### Acceptance Criteria

1. WHEN a patrolling session is active, THE System SHALL maintain a history of reviewed diffs
2. WHEN displaying statistics, THE System SHALL show session revert counts and active patroller information
3. WHEN talk page messages or thanks are received, THE System SHALL provide visual notifications
4. WHEN the session ends, THE System SHALL preserve session statistics for review
5. THE System SHALL display real-time counts of active patrollers and system activity

### Requirement 8: Keyboard Navigation and Shortcuts

**User Story:** As a patroller, I want comprehensive keyboard shortcuts, so that I can work efficiently without relying on mouse interactions.

#### Acceptance Criteria

1. WHEN keyboard shortcuts are pressed, THE System SHALL execute corresponding actions immediately
2. WHEN navigating change lists, THE System SHALL support arrow key movement and selection
3. WHEN in diff view, THE System SHALL provide shortcuts for common actions like revert, next/previous diff
4. WHEN performing user actions, THE System SHALL offer keyboard shortcuts for blocking, messaging, and other operations
5. THE System SHALL display available shortcuts contextually and allow customization

### Requirement 9: Authentication and Authorization

**User Story:** As a patroller, I want secure authentication with appropriate permissions, so that I can perform authorized actions safely.

#### Acceptance Criteria

1. WHEN accessing the Patrol_Tool, THE System SHALL authenticate users via OAuth with MediaWiki
2. WHEN performing privileged actions, THE System SHALL verify user permissions before execution
3. WHEN user permissions change, THE System SHALL update available actions dynamically
4. WHEN authentication expires, THE System SHALL prompt for re-authentication without losing session data
5. THE System SHALL maintain secure communication with MediaWiki APIs throughout the session

### Requirement 10: Cross-Wiki Support and Configuration

**User Story:** As a patroller, I want to patrol multiple wikis and customize the interface, so that I can work across different projects efficiently.

#### Acceptance Criteria

1. WHEN switching between wikis, THE System SHALL maintain separate filter settings and session data
2. WHEN configuring the interface, THE System SHALL allow customization of layout, filters, and display preferences
3. WHEN importing configuration, THE System SHALL support loading settings from Wikipedia or external sources
4. WHEN working with different wikis, THE System SHALL adapt available actions based on wiki-specific policies
5. THE System SHALL preserve user preferences across sessions and wiki switches