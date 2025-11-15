# Comparison Feature - Keyboard Navigation Guide

## Overview
The candidate comparison feature is fully accessible via keyboard navigation, meeting WCAG AA accessibility standards.

## Keyboard Shortcuts

### Candidate Selection
| Key | Action |
|-----|--------|
| `Tab` | Navigate to next candidate checkbox |
| `Shift + Tab` | Navigate to previous candidate checkbox |
| `Space` | Toggle candidate selection (when checkbox is focused) |
| `Enter` | Toggle candidate selection (when checkbox is focused) |

### Comparison Toolbar
| Key | Action |
|-----|--------|
| `Tab` | Navigate through toolbar buttons (Clear, Compare, Export) |
| `Shift + Tab` | Navigate backwards through toolbar buttons |
| `Enter` / `Space` | Activate focused button |
| `Escape` | Clear all selections (when any toolbar button is focused) |

### Export Menu
| Key | Action |
|-----|--------|
| `Enter` / `Space` | Open export format menu (when Export button is focused) |
| `↓` / `↑` | Navigate through export format options (CSV, JSON) |
| `Enter` | Select export format |
| `Escape` | Close export menu |

### Comparison Modal
| Key | Action |
|-----|--------|
| `Escape` | Close comparison modal |
| `Tab` | Navigate through candidate columns and remove buttons |
| `Shift + Tab` | Navigate backwards |
| `Enter` / `Space` | Activate focused remove button |
| `Arrow Keys` | Scroll through comparison table |

### Screen Reader Support

#### Selection Announcements
- When a candidate is selected: "1 candidate selected. Select at least 1 more to compare."
- When 2 candidates are selected: "2 candidates selected"
- When 3 candidates are selected (max): "3 candidates selected (maximum reached)"
- When selection is cleared: "No candidates selected"

#### Comparison Toolbar Announcements
- Compare button: "Compare 2 selected candidates" (or 3, depending on selection count)
- Compare button (disabled): "Select at least 2 candidates to compare"
- Compare button (over max): "Maximum 3 candidates can be compared"
- Export button: "Export 2 selected candidates" (shows count)
- Clear button: "Clear all selections"

#### Comparison Modal Announcements
- Modal opens: "Candidate comparison"
- Loading state: "Loading candidate details..."
- Error state: "Failed to load candidate details. Please try again."
- Remove candidate: "Remove [Candidate Name] from comparison"

## ARIA Labels

### Candidate Card
```html
<mat-checkbox
  [attr.aria-label]="'Select ' + candidate.name + ' for comparison'"
  [attr.aria-disabled]="selectionDisabled && !isSelected"
/>
```

### Comparison Toolbar
```html
<button
  aria-label="Compare selected candidates"
  [attr.title]="getCompareTooltip()"
/>
<button
  aria-label="Export selected candidates"
  [matMenuTriggerFor]="exportMenu"
/>
<button
  aria-label="Clear all selections"
/>
```

### Comparison Modal
```html
<h2 id="comparison-modal-title" aria-level="1">
  Candidate Comparison
</h2>
<table role="table" aria-label="Candidate comparison">
  <thead role="rowgroup">
    <tr role="row">
      <th scope="col" role="columnheader">Attribute</th>
      ...
    </tr>
  </thead>
  <tbody role="rowgroup">
    ...
  </tbody>
</table>
```

## Focus Indicators

All interactive elements have visible focus indicators meeting WCAG AA requirements (2px solid outline with 2px offset):

- **Checkboxes**: Red outline (#d32f2f) with subtle shadow
- **Buttons**: Red outline (#d32f2f) with subtle shadow
- **Menu Items**: Red outline (#d32f2f) with subtle shadow
- **Remove Buttons**: Red outline (#d32f2f) with subtle shadow

### High Contrast Mode
In high contrast mode (`prefers-contrast: high`), focus indicators are enhanced:
- Outline width: 3px (instead of 2px)
- Outline color: Black (#000000) for maximum contrast
- Offset: 3px (instead of 2px)

## Color Contrast Ratios

All text and interactive elements meet WCAG AA requirements (4.5:1 for normal text, 3:1 for large text):

| Element | Foreground | Background | Ratio | Passes |
|---------|-----------|------------|-------|--------|
| Primary button text | #ffffff | #d32f2f | 5.2:1 | ✅ AA |
| Toolbar text | #424242 | #ffffff | 9.7:1 | ✅ AAA |
| Disabled text | #757575 | #ffffff | 4.6:1 | ✅ AA |
| Link text | #d32f2f | #ffffff | 5.2:1 | ✅ AA |
| Badge text (available) | #2e7d32 | #e8f5e9 | 4.8:1 | ✅ AA |

## Testing Recommendations

### Manual Testing
1. **Keyboard-only navigation**: Navigate the entire comparison feature using only keyboard (no mouse)
2. **Screen reader testing**: Test with NVDA (Windows) or VoiceOver (macOS)
3. **Focus visibility**: Ensure focus indicators are visible on all interactive elements
4. **Tab order**: Verify logical tab order through all comparison controls

### Automated Testing
- Run AXE DevTools accessibility audit
- Verify 0 violations, 0 errors
- Check ARIA attributes are correctly applied
- Validate color contrast ratios

## Known Limitations

1. **Maximum 3 Candidates**: Enforced for performance and UX clarity
2. **Desktop-Optimized**: Best experience on desktop; mobile uses horizontal scroll
3. **Modal Scrolling**: Long attribute lists may require vertical scrolling in modal

## Future Enhancements

- [ ] Range selection with Shift+Click
- [ ] Select all with Ctrl+A / Cmd+A
- [ ] Deselect all with Escape (when candidate list is focused)
- [ ] Arrow key navigation between candidates
- [ ] Home/End keys to jump to first/last candidate

## Resources

- [WCAG 2.1 AA Guidelines](https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_overview&levels=aaa)
- [AXE DevTools](https://www.deque.com/axe/devtools/)
- [Angular Accessibility Guide](https://angular.dev/best-practices/a11y)
