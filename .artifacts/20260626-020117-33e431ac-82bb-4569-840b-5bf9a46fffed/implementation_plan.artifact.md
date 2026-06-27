# System Dissection & Behavioral Loop Integration

This plan outlines the transformation of Alera from an "app" into a behavioral operating system. The goal is to reduce friction between intention and action for "ambitious but paralyzed" users by enforcing a 6-stage loop: **Capture, Clarify, Commit, Control, Confront, and Adjust.**

## Proposed Changes

### Core System Logic

#### [forge-store.ts](file:///C:/Users/PC/StudioProjects/forge-human-operating-system/lib/forge-store.ts)
- Add state for "Today's Mission" (singular) vs tasks.
- Track "Session Start Intent" vs "Session Completion Reality".
- Implement `confrontationData` to store the gap between planned vs actual.

### Stage 1 & 2: Capture & Clarify (Identity Engine)

#### [minddump.tsx](file:///C:/Users/PC/StudioProjects/forge-human-operating-system/components/screens/minddump.tsx)
- Overhaul prompts to focus on extracting "Identity Labels" (e.g., Builder, Founder).
- Background logic will parse the dump into the `profiles` table's `destination`, `current_reality`, and `gap` fields using the Identity Engine logic.

### Stage 3: Commit (The Workspace)

#### [today.tsx](file:///C:/Users/PC/StudioProjects/forge-human-operating-system/components/screens/today.tsx)
- Enforce the "One Mission, Max Three Actions" constraint.
- Prioritize the "Next Action" with a large, singular "Begin Focus" button to optimize for *starting*.

### Stage 4: Control (Execution Engine)

#### [focus.tsx](file:///C:/Users/PC/StudioProjects/forge-human-operating-system/components/screens/focus.tsx)
- Entering Focus Mode must hide all other UI elements (silence the world).
- Log distractions or "why I stopped" as feedback data.

### Stage 5 & 6: Confront & Adjust (The Mirror)

#### [reflection.tsx](file:///C:/Users/PC/StudioProjects/forge-human-operating-system/components/screens/reflection.tsx)
- Redesign the reflection flow into a "Confrontation" stage.
- Present the "Mirror": *"You claimed X, but did Y. Here is the gap."*
- Trigger the Adaptation Engine to update the user's `behavior_patterns` and set the win/loss condition for the day.

## Verification Plan

### Manual Verification
1. **Onboarding Loop**: Complete a mind dump and verify that the system extracts a clear Identity and Mission.
2. **Commitment Test**: Set 3 tasks, complete 1, and verify that the "Confront" stage accurately reflects the 33% execution rate.
3. **Adaptation Test**: Log a failure in the evening three days in a row; verify that the system suggests moving the task to a different window (simulated via pattern data).
