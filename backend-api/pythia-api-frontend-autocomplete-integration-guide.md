# Pythia Frontend - Autocomplete Integration Guide

**Version:** 1.0  
**Date:** 2025-11-15  
**Audience:** Frontend Developers  
**Prerequisites:** Angular, RxJS, HTTP Client

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [API Endpoint](#api-endpoint)
3. [Integration Strategy](#integration-strategy)
4. [Implementation Steps](#implementation-steps)
5. [Code Examples](#code-examples)
6. [UI/UX Recommendations](#uiux-recommendations)
7. [Performance Optimization](#performance-optimization)
8. [Error Handling](#error-handling)
9. [Testing](#testing)

---

## 1. Overview

The Pythia autocomplete API provides **type-ahead suggestions** as users type in the search box. It returns suggestions from **6 different categories**:

- 👤 **Employee Names** - Direct employee matches
- 💼 **Job Titles** - Common roles (e.g., "Senior Backend Developer")
- 🔧 **Technologies** - Programming languages, frameworks (e.g., "React", "Kotlin")
- 🎯 **Skills** - Professional skills (e.g., "API Design", "Data Modeling")
- 🏢 **Companies** - Previous employers (e.g., "Google", "Microsoft")
- 🎓 **Certifications** - Professional certifications (e.g., "AWS Certified Developer")

### Key Features

✅ **Fast prefix matching** - Returns results in < 100ms  
✅ **Case-insensitive** - Works with any case input  
✅ **Relevance-based ordering** - Sorted by popularity (employee count)  
✅ **Configurable limits** - Control number of suggestions per category  
✅ **Metadata support** - Employee names include `employeeId` for direct navigation  

---

## 2. API Endpoint

### Endpoint URL

```
GET http://localhost:8080/api/v1/autocomplete
```

### Query Parameters

| Parameter | Type | Required | Default | Max | Description |
|-----------|------|----------|---------|-----|-------------|
| `query` | string | ✅ Yes | - | - | Partial text to search for (minimum 2 characters) |
| `limit` | number | ❌ No | 10 | 20 | Maximum suggestions per category |

### Request Examples

```http
# Basic autocomplete
GET http://localhost:8080/api/v1/autocomplete?query=react

# With custom limit
GET http://localhost:8080/api/v1/autocomplete?query=senior&limit=5

# URL-encoded query
GET http://localhost:8080/api/v1/autocomplete?query=data%20engineer&limit=10
```

### Response Format

```typescript
interface AutocompleteResponse {
  query: string;                    // Original query string
  suggestions: Suggestion[];        // Array of suggestions
}

interface Suggestion {
  type: SuggestionType;            // Category of suggestion
  value: string;                   // Display text
  count: number | null;            // Number of employees (null for employee names)
  metadata: Record<string, string> | null;  // Additional data (e.g., employeeId)
}

type SuggestionType = 
  | 'employee_name'
  | 'job_title'
  | 'technology'
  | 'skill'
  | 'company'
  | 'certification';
```

### Response Example

```json
{
  "query": "react",
  "suggestions": [
    {
      "type": "technology",
      "value": "React",
      "count": 5,
      "metadata": null
    },
    {
      "type": "technology",
      "value": "React Native",
      "count": 2,
      "metadata": null
    },
    {
      "type": "job_title",
      "value": "React Developer",
      "count": 3,
      "metadata": null
    }
  ]
}
```

---

## 3. Integration Strategy

### When to Call Autocomplete

**✅ DO:**
- Call autocomplete as user types in the search input
- Debounce requests (300-500ms) to avoid excessive API calls
- Show suggestions in a dropdown below the search box
- Allow keyboard navigation (↑↓ arrows, Enter to select)

**❌ DON'T:**
- Call autocomplete on every keystroke without debouncing
- Call autocomplete for queries < 2 characters (API will return empty)
- Block the search functionality while autocomplete is loading

### Relationship with Search API

```
┌─────────────────────────────────────────────────────────────┐
│  User Types: "react"                                        │
└─────────────────────────────────────────────────────────────┘
                          │
                          ├─────────────────────────────────┐
                          │                                 │
                          ▼                                 ▼
              ┌───────────────────────┐       ┌──────────────────────┐
              │  AUTOCOMPLETE API     │       │   SEARCH API         │
              │  (Type-ahead)         │       │   (Full search)      │
              ├───────────────────────┤       ├──────────────────────┤
              │ GET /autocomplete     │       │ GET /search          │
              │ ?query=react          │       │ ?query=react         │
              │ &limit=10             │       │ &topK=10             │
              │                       │       │ &minScore=0.7        │
              └───────────────────────┘       └──────────────────────┘
                          │                                 │
                          ▼                                 ▼
              ┌───────────────────────┐       ┌──────────────────────┐
              │  Show Suggestions     │       │  Show Results        │
              │  - React (5)          │       │  - Employee cards    │
              │  - React Native (2)   │       │  - Pagination        │
              │  - React Developer    │       │  - Facets/filters    │
              └───────────────────────┘       └──────────────────────┘
```

**Key Difference:**
- **Autocomplete** = Suggestions while typing (fast, lightweight)
- **Search** = Full results after user submits query (comprehensive, with ranking)

---

## 4. Implementation Steps

### Step 1: Create TypeScript Interfaces

```typescript
// src/app/models/autocomplete.model.ts

export interface AutocompleteResponse {
  query: string;
  suggestions: Suggestion[];
}

export interface Suggestion {
  type: SuggestionType;
  value: string;
  count: number | null;
  metadata: Record<string, string> | null;
}

export type SuggestionType = 
  | 'employee_name'
  | 'job_title'
  | 'technology'
  | 'skill'
  | 'company'
  | 'certification';

// Helper to group suggestions by type
export interface GroupedSuggestions {
  employeeNames: Suggestion[];
  jobTitles: Suggestion[];
  technologies: Suggestion[];
  skills: Suggestion[];
  companies: Suggestion[];
  certifications: Suggestion[];
}
```

### Step 2: Create Autocomplete Service

```typescript
// src/app/services/autocomplete.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AutocompleteResponse, Suggestion, GroupedSuggestions } from '../models/autocomplete.model';

@Injectable({
  providedIn: 'root'
})
export class AutocompleteService {
  private apiUrl = 'http://localhost:8080/api/v1/autocomplete';

  constructor(private http: HttpClient) {}

  /**
   * Get autocomplete suggestions for a query
   * @param query - Partial text to search for (minimum 2 characters)
   * @param limit - Maximum suggestions per category (default: 10, max: 20)
   */
  getSuggestions(query: string, limit: number = 10): Observable<AutocompleteResponse> {
    const params = new HttpParams()
      .set('query', query)
      .set('limit', limit.toString());

    return this.http.get<AutocompleteResponse>(this.apiUrl, { params });
  }

  /**
   * Group suggestions by type for easier rendering
   */
  groupSuggestions(suggestions: Suggestion[]): GroupedSuggestions {
    return {
      employeeNames: suggestions.filter(s => s.type === 'employee_name'),
      jobTitles: suggestions.filter(s => s.type === 'job_title'),
      technologies: suggestions.filter(s => s.type === 'technology'),
      skills: suggestions.filter(s => s.type === 'skill'),
      companies: suggestions.filter(s => s.type === 'company'),
      certifications: suggestions.filter(s => s.type === 'certification')
    };
  }
}
```

### Step 3: Update Search Component

```typescript
// src/app/components/search/search.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil, filter } from 'rxjs/operators';
import { AutocompleteService } from '../../services/autocomplete.service';
import { SearchService } from '../../services/search.service';
import { AutocompleteResponse, Suggestion } from '../../models/autocomplete.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  suggestions: Suggestion[] = [];
  showSuggestions = false;
  selectedIndex = -1;
  
  private destroy$ = new Subject<void>();

  constructor(
    private autocompleteService: AutocompleteService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    // Setup autocomplete
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),                    // Wait 300ms after user stops typing
        distinctUntilChanged(),               // Only if value changed
        filter(query => query && query.length >= 2),  // Minimum 2 characters
        switchMap(query => 
          this.autocompleteService.getSuggestions(query, 10)
        ),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response: AutocompleteResponse) => {
          this.suggestions = response.suggestions;
          this.showSuggestions = this.suggestions.length > 0;
          this.selectedIndex = -1;
        },
        error: (error) => {
          console.error('Autocomplete error:', error);
          this.suggestions = [];
          this.showSuggestions = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Handle keyboard navigation
   */
  onKeyDown(event: KeyboardEvent): void {
    if (!this.showSuggestions) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, this.suggestions.length - 1);
        break;
      
      case 'ArrowUp':
        event.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
        break;
      
      case 'Enter':
        event.preventDefault();
        if (this.selectedIndex >= 0) {
          this.selectSuggestion(this.suggestions[this.selectedIndex]);
        } else {
          this.performSearch();
        }
        break;
      
      case 'Escape':
        this.showSuggestions = false;
        this.selectedIndex = -1;
        break;
    }
  }

  /**
   * Select a suggestion
   */
  selectSuggestion(suggestion: Suggestion): void {
    // If it's an employee name, navigate directly to employee detail
    if (suggestion.type === 'employee_name' && suggestion.metadata?.employeeId) {
      this.navigateToEmployee(suggestion.metadata.employeeId);
      return;
    }

    // Otherwise, populate search box and perform search
    this.searchControl.setValue(suggestion.value, { emitEvent: false });
    this.showSuggestions = false;
    this.performSearch();
  }

  /**
   * Perform full search
   */
  performSearch(): void {
    const query = this.searchControl.value;
    if (!query || query.length < 2) return;

    this.showSuggestions = false;
    
    // Call your existing search API
    this.searchService.search({
      query: query,
      topK: 10,
      minScore: 0.7
    }).subscribe({
      next: (results) => {
        // Handle search results (your existing logic)
        console.log('Search results:', results);
      },
      error: (error) => {
        console.error('Search error:', error);
      }
    });
  }

  /**
   * Navigate to employee detail page
   */
  private navigateToEmployee(employeeId: string): void {
    // Implement navigation to employee detail
    // Example: this.router.navigate(['/employees', employeeId]);
    console.log('Navigate to employee:', employeeId);
  }

  /**
   * Get icon for suggestion type
   */
  getSuggestionIcon(type: string): string {
    const icons: Record<string, string> = {
      'employee_name': '👤',
      'job_title': '💼',
      'technology': '🔧',
      'skill': '🎯',
      'company': '🏢',
      'certification': '🎓'
    };
    return icons[type] || '•';
  }

  /**
   * Get label for suggestion type
   */
  getSuggestionTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'employee_name': 'Employee',
      'job_title': 'Job Title',
      'technology': 'Technology',
      'skill': 'Skill',
      'company': 'Company',
      'certification': 'Certification'
    };
    return labels[type] || type;
  }
}
```

---

## 5. Code Examples

### HTML Template

```html
<!-- src/app/components/search/search.component.html -->

<div class="search-container">
  <!-- Search Input -->
  <div class="search-input-wrapper">
    <input
      type="text"
      [formControl]="searchControl"
      (keydown)="onKeyDown($event)"
      (focus)="showSuggestions = suggestions.length > 0"
      (blur)="onBlur()"
      placeholder="Find React developers in Zurich"
      class="search-input"
    />
    
    <button 
      (click)="performSearch()" 
      class="search-button"
      [disabled]="!searchControl.value || searchControl.value.length < 2"
    >
      Search
    </button>
  </div>

  <!-- Autocomplete Dropdown -->
  <div 
    *ngIf="showSuggestions" 
    class="autocomplete-dropdown"
  >
    <div 
      *ngFor="let suggestion of suggestions; let i = index"
      class="suggestion-item"
      [class.selected]="i === selectedIndex"
      (mousedown)="selectSuggestion(suggestion)"
      (mouseenter)="selectedIndex = i"
    >
      <span class="suggestion-icon">{{ getSuggestionIcon(suggestion.type) }}</span>
      <div class="suggestion-content">
        <div class="suggestion-value">{{ suggestion.value }}</div>
        <div class="suggestion-meta">
          <span class="suggestion-type">{{ getSuggestionTypeLabel(suggestion.type) }}</span>
          <span *ngIf="suggestion.count" class="suggestion-count">
            {{ suggestion.count }} {{ suggestion.count === 1 ? 'employee' : 'employees' }}
          </span>
        </div>
      </div>
    </div>

    <div *ngIf="suggestions.length === 0" class="no-suggestions">
      No suggestions found
    </div>
  </div>
</div>
```

### SCSS Styles

```scss
// src/app/components/search/search.component.scss

.search-container {
  position: relative;
  width: 100%;
  max-width: 600px;
}

.search-input-wrapper {
  display: flex;
  gap: 8px;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #1976d2;
  }
}

.search-button {
  padding: 12px 24px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #1565c0;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
}

.autocomplete-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
}

.suggestion-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover,
  &.selected {
    background-color: #f5f5f5;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }
}

.suggestion-icon {
  font-size: 20px;
  margin-right: 12px;
}

.suggestion-content {
  flex: 1;
  min-width: 0;
}

.suggestion-value {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.suggestion-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #666;
}

.suggestion-type {
  text-transform: capitalize;
}

.suggestion-count {
  color: #999;
  
  &::before {
    content: '•';
    margin-right: 8px;
  }
}

.no-suggestions {
  padding: 16px;
  text-align: center;
  color: #999;
  font-size: 14px;
}
```

---

## 6. UI/UX Recommendations

### Best Practices

1. **Debouncing** - Wait 300-500ms after user stops typing before calling API
2. **Minimum Characters** - Only show autocomplete for queries ≥ 2 characters
3. **Keyboard Navigation** - Support ↑↓ arrows, Enter, and Escape keys
4. **Visual Feedback** - Highlight selected suggestion
5. **Loading State** - Show spinner while fetching suggestions
6. **Empty State** - Show helpful message when no suggestions found
7. **Click Outside** - Close dropdown when user clicks outside
8. **Mobile Friendly** - Ensure dropdown works well on touch devices

### Grouping Suggestions (Optional)

For better UX, you can group suggestions by type:

```html
<div class="autocomplete-dropdown">
  <!-- Employee Names -->
  <div *ngIf="groupedSuggestions.employeeNames.length > 0" class="suggestion-group">
    <div class="group-header">👤 Employees</div>
    <div *ngFor="let suggestion of groupedSuggestions.employeeNames" class="suggestion-item">
      <!-- ... -->
    </div>
  </div>

  <!-- Technologies -->
  <div *ngIf="groupedSuggestions.technologies.length > 0" class="suggestion-group">
    <div class="group-header">🔧 Technologies</div>
    <div *ngFor="let suggestion of groupedSuggestions.technologies" class="suggestion-item">
      <!-- ... -->
    </div>
  </div>

  <!-- ... other groups ... -->
</div>
```

---

## 7. Performance Optimization

### Caching Strategy

```typescript
import { shareReplay } from 'rxjs/operators';

// Cache autocomplete results for 5 minutes
private cache = new Map<string, { data: AutocompleteResponse, timestamp: number }>();
private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

getSuggestionsWithCache(query: string, limit: number = 10): Observable<AutocompleteResponse> {
  const cacheKey = `${query.toLowerCase()}_${limit}`;
  const cached = this.cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
    return of(cached.data);
  }

  return this.getSuggestions(query, limit).pipe(
    tap(data => {
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
    })
  );
}
```

### Optimizations

- ✅ Use `debounceTime(300)` to reduce API calls
- ✅ Use `distinctUntilChanged()` to avoid duplicate requests
- ✅ Use `switchMap()` to cancel previous requests
- ✅ Limit suggestions per category (default: 10)
- ✅ Cache results for frequently searched terms

---

## 8. Error Handling

```typescript
this.searchControl.valueChanges
  .pipe(
    debounceTime(300),
    distinctUntilChanged(),
    filter(query => query && query.length >= 2),
    switchMap(query => 
      this.autocompleteService.getSuggestions(query, 10).pipe(
        catchError(error => {
          console.error('Autocomplete error:', error);
          // Return empty suggestions on error
          return of({ query, suggestions: [] });
        })
      )
    ),
    takeUntil(this.destroy$)
  )
  .subscribe(response => {
    this.suggestions = response.suggestions;
    this.showSuggestions = this.suggestions.length > 0;
  });
```

---

## 9. Testing

### Unit Test Example

```typescript
// search.component.spec.ts

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { SearchComponent } from './search.component';
import { AutocompleteService } from '../../services/autocomplete.service';

describe('SearchComponent - Autocomplete', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let autocompleteService: jasmine.SpyObj<AutocompleteService>;

  beforeEach(() => {
    const autocompleteSpy = jasmine.createSpyObj('AutocompleteService', ['getSuggestions']);

    TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AutocompleteService, useValue: autocompleteSpy }
      ]
    });

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    autocompleteService = TestBed.inject(AutocompleteService) as jasmine.SpyObj<AutocompleteService>;
  });

  it('should call autocomplete API after debounce', fakeAsync(() => {
    const mockResponse = {
      query: 'react',
      suggestions: [
        { type: 'technology', value: 'React', count: 5, metadata: null }
      ]
    };
    autocompleteService.getSuggestions.and.returnValue(of(mockResponse));

    component.searchControl.setValue('react');
    tick(300); // Wait for debounce

    expect(autocompleteService.getSuggestions).toHaveBeenCalledWith('react', 10);
    expect(component.suggestions.length).toBe(1);
    expect(component.showSuggestions).toBe(true);
  }));

  it('should not call API for queries < 2 characters', fakeAsync(() => {
    component.searchControl.setValue('a');
    tick(300);

    expect(autocompleteService.getSuggestions).not.toHaveBeenCalled();
  }));
});
```

---

## 📚 Summary

### Quick Checklist

- ✅ Add autocomplete service with `getSuggestions()` method
- ✅ Setup RxJS pipeline with debounce, filter, switchMap
- ✅ Create dropdown UI with keyboard navigation
- ✅ Handle employee name clicks (navigate to detail page)
- ✅ Handle other suggestions (populate search and execute)
- ✅ Add loading and error states
- ✅ Style dropdown with proper UX
- ✅ Test on desktop and mobile

### Key Differences: Autocomplete vs Search

| Feature | Autocomplete API | Search API |
|---------|------------------|------------|
| **Purpose** | Type-ahead suggestions | Full search results |
| **Endpoint** | `/api/v1/autocomplete` | `/api/v1/search` |
| **When** | While typing (debounced) | On submit/Enter |
| **Response** | Suggestion list | Employee results with ranking |
| **Speed** | < 100ms | < 500ms |
| **Parameters** | `query`, `limit` | `query`, `topK`, `minScore`, filters |

---

**Questions?** Contact the backend team or refer to the API tests in `02-api-testing/pythia-api-rest-endpoints-http-test/autocomplete/`

