# Maze Solver Robot - Design Guidelines

## Design Approach
**System-Based Approach: Material Design** - Selected for its strong support of data-rich interfaces, clear visual feedback systems, and component patterns ideal for interactive tools and educational applications.

## Design Principles
1. **Clarity First**: Every element must clearly communicate the algorithm's state and progress
2. **Immediate Feedback**: All interactions provide instant visual response
3. **Progressive Disclosure**: Complex controls revealed contextually
4. **Educational Focus**: Design supports learning and understanding, not just aesthetics

---

## Typography System

**Font Family**: 
- Primary: 'Inter' or 'Roboto' from Google Fonts
- Monospace: 'Roboto Mono' for statistics and coordinates

**Type Scale**:
- Page Title: text-3xl font-bold (Algorithm name, app title)
- Section Headers: text-xl font-semibold (Control Panel, Statistics, Grid)
- Labels: text-sm font-medium (Button labels, stat names)
- Data/Numbers: text-base font-mono (Coordinates, step counts)
- Helper Text: text-xs (Instructions, tooltips)

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 8, 12, 16** consistently
- Component padding: p-4 or p-6
- Section gaps: gap-8 or gap-12
- Button padding: px-4 py-2
- Grid cells: Calculated dynamically based on viewport

**Grid Structure**:
```
Desktop Layout (3-column):
- Left Sidebar (w-80): Controls, presets, instructions
- Center Area (flex-1): Maze grid visualization
- Right Sidebar (w-72): Statistics, stack visualization

Mobile Layout (stacked):
- Full-width maze grid at top
- Collapsible control panel
- Statistics in expandable drawer
```

**Container Constraints**:
- Maximum app width: max-w-screen-2xl mx-auto
- Minimum grid size: 20x20 cells on desktop, 12x12 on mobile
- Grid cell size: Responsive (minimum 24px, maximum 48px)

---

## Component Library

### 1. Maze Grid (Primary Component)
- **Structure**: Dynamic grid using CSS Grid (grid-cols-[dynamic])
- **Cell States**: Default (empty), Wall, Start, End, Visited, Current, Path, Backtracked
- **Interactions**: Click to toggle walls, drag to paint, right-click to erase
- **Borders**: 1px borders between cells for clarity
- **Cell aspect ratio**: Always square (aspect-square)

### 2. Control Panel
**Layout**: Vertical stack with gap-6

**Components**:
- Play/Pause button (primary, large - h-12 w-12 rounded-full)
- Step Forward/Backward buttons (secondary, h-10 w-10)
- Speed slider (full-width with labeled ticks: Slow, Normal, Fast)
- Reset button (destructive style)
- Clear Maze button (secondary)
- Algorithm selector (if multiple algorithms)

**Grouping**: Related controls in cards with p-4 and rounded-lg borders

### 3. Statistics Dashboard
**Layout**: Vertical list with gap-4

**Metrics Display**:
- Each metric in a card: flex justify-between items-center p-3
- Label on left (text-sm font-medium)
- Value on right (text-xl font-bold font-mono)

**Key Metrics**:
- Steps Taken
- Backtracks
- Cells Visited
- Path Length
- Time Elapsed

### 4. Stack Visualization
**Component**: Vertical list showing last 8-10 stack entries
- Each entry: small card with coordinate display (x, y)
- Top of stack highlighted with stronger visual weight
- Scroll container if stack exceeds height
- Empty state message when stack is empty

### 5. Preset Maze Selector
- Grid of thumbnail buttons (grid-cols-2 gap-3)
- Each preset: Small maze preview + label below
- Hover state shows maze name
- Presets include: Simple Path, Multiple Deadends, Spiral, Complex Maze

### 6. Action Buttons
**Primary Actions**: Solid background, medium weight
**Secondary Actions**: Outlined style with border-2
**Icon Buttons**: Circular (rounded-full) for playback controls
**All buttons**: px-4 py-2 minimum, rounded-md (or rounded-full for icon-only)

### 7. Visual Legend
Small component showing color/pattern meanings:
- Compact horizontal layout on desktop
- Each item: small square + label
- Positioned near grid (top-right corner or below)

---

## Animation Strategy

**Grid Animations**: 
- Cell state changes: Quick fade transition (duration-200)
- Robot movement: Smooth position transition (duration-300)
- Path highlighting: Cascade effect when solution found

**Control Feedback**:
- Button press: Scale down slightly (scale-95)
- No complex hover animations on grid cells (performance)

**Speed Control**: All animation durations multiply by speed factor (0.5x to 2x)

---

## Interaction Patterns

### Grid Editing Mode
- Default: Click to toggle wall
- Drag: Paint multiple walls
- Shift+Click: Set start point
- Alt+Click: Set end point
- Clear visual indicators for current mode

### Algorithm Visualization Mode
- Grid becomes read-only
- Controls focus on playback
- Real-time updates to statistics
- Stack visualization updates with each step

### Responsive Behavior
- Grid scales proportionally to viewport
- Controls collapse to drawer/modal on mobile
- Statistics move to bottom sheet
- Maintain square cells at all breakpoints

---

## Accessibility Implementation

- All interactive cells: Keyboard navigation (arrow keys)
- Control buttons: Clear focus indicators (ring-2 ring-offset-2)
- Status announcements: Screen reader updates for algorithm progress
- High contrast cell states (not color-dependent alone)
- Minimum touch target: 44x44px for mobile

---

## Icon Usage

**Library**: Material Icons via CDN

**Key Icons**:
- play_arrow, pause, skip_next, skip_previous (playback)
- refresh, clear (actions)
- location_on (start/end markers)
- grid_on (grid toggle)
- speed (speed control)

---

## Layout Priority

**Desktop First Design**: Optimized for algorithm observation on larger screens, with thoughtful mobile adaptations that prioritize grid visibility and essential controls.