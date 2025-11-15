# Material Icons Design System - Pythia+

> **Last Updated**: 2025-11-15
> **Purpose**: Consistent Material Icon usage across the application
> **Color**: Swiss Red (`--color-primary-500: #DC3545`)

---

## 🎨 Design Pattern

### Icon Sizes
- **Large (32px)**: Stats, headers, feature highlights
- **Medium (24px)**: Section icons, primary actions
- **Small (18px)**: Inline icons, buttons, badges
- **Tiny (16px)**: Metadata, supplementary info

### Color Scheme
- **Primary**: `--color-primary-500` (#DC3545 - Pythia Red)
- **Opacity**: 0.8 for softer, professional look
- **Neutral**: `--color-neutral-600` for secondary icons
- **Contextual**: Success (green), Warning (yellow), Danger (red)

---

## 📦 Icon Mapping

### Employee Profile Icons

#### Contact & Communication
- `email` - Email address
- `phone` - Phone number
- `location_on` - Location/Address
- `business` - Department/Company

#### Professional Info
- `work` or `business_center` - Work/Projects
- `school` - Education
- `military_tech` - Certifications
- `language` - Languages
- `code` - Technologies
- `build` - Skills

#### Status & Availability
- `check_circle` - Available (green)
- `schedule` - Notice Period (yellow)
- `cancel` - Unavailable (red)
- `work_outline` - Busy (grey)

#### Actions
- `download` - Export CV
- `arrow_back` - Back navigation
- `open_in_new` - External links

#### Metadata
- `calendar_today` - Dates
- `timer` - Duration
- `star` - Ratings/Seniority
- `trending_up` - Progress/Experience

---

## 💻 CSS Classes

### Global Icon Styles

```scss
// Large icons (32px) - for stats and headers
.icon-lg {
  font-size: 32px;
  width: 32px;
  height: 32px;
  color: var(--color-primary-500);
  opacity: 0.8;
}

// Medium icons (24px) - for sections
.icon-md {
  font-size: 24px;
  width: 24px;
  height: 24px;
  color: var(--color-primary-500);
  opacity: 0.8;
}

// Small icons (18px) - for inline use
.icon-sm {
  font-size: 18px;
  width: 18px;
  height: 18px;
  color: var(--color-neutral-600);
  opacity: 0.9;
}

// Tiny icons (16px) - for metadata
.icon-xs {
  font-size: 16px;
  width: 16px;
  height: 16px;
  color: var(--color-neutral-500);
  opacity: 0.9;
}

// Section title icons (24px with spacing)
.section-icon {
  font-size: 24px;
  width: 24px;
  height: 24px;
  color: var(--color-primary-500);
  opacity: 0.8;
  vertical-align: middle;
  margin-right: var(--spacing-xs);
}
```

---

## 📝 Usage Examples

### In HTML Templates

```html
<!-- Stats/Headers (32px) -->
<mat-icon class="icon-lg">search</mat-icon>

<!-- Section Titles (24px) -->
<h2>
  <mat-icon class="section-icon">work</mat-icon>
  Project History
</h2>

<!-- Contact Info (18px) -->
<mat-icon class="icon-sm">email</mat-icon>
<a href="mailto:...">email@example.com</a>

<!-- Metadata (16px) -->
<mat-icon class="icon-xs">calendar_today</mat-icon>
<time>Jan 2024</time>
```

### Color Variants

```html
<!-- Success/Available (green) -->
<mat-icon class="icon-sm" style="color: var(--color-success-500)">
  check_circle
</mat-icon>

<!-- Warning/Expiring (yellow) -->
<mat-icon class="icon-sm" style="color: var(--color-warning-500)">
  warning
</mat-icon>

<!-- Danger/Unavailable (red) -->
<mat-icon class="icon-sm" style="color: var(--color-danger-500)">
  cancel
</mat-icon>
```

---

## 🔗 Material Icons Reference

**Official Documentation**: https://fonts.google.com/icons
**CDN**: Already loaded via Angular Material

---

## ✅ Consistency Checklist

- [ ] All emojis replaced with Material Icons
- [ ] Consistent sizing (use classes: icon-lg, icon-md, icon-sm, icon-xs)
- [ ] Pythia red color (`--color-primary-500`) for primary icons
- [ ] Opacity 0.8 for professional, softer look
- [ ] Proper alignment with text (vertical-align: middle)
- [ ] Accessibility: ARIA labels on icon-only buttons

---

**Last Updated**: 2025-11-15
**Status**: ✅ Design system defined, ready for implementation
