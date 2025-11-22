import { Injectable } from '@angular/core';
import { Candidate } from '../models/candidate.model';

/**
 * Export Service - Simple CSV and JSON Export
 *
 * Purpose: Export selected candidates to downloadable files
 * Features: CSV export, JSON export, browser-native downloads (no external libraries)
 *
 * Note: PDF export not implemented (would require jsPDF library)
 */
@Injectable({
  providedIn: 'root'
})
export class ExportService {

  /**
   * Export candidates to CSV format
   * Downloads file: pythia-candidates-{timestamp}.csv
   */
  exportToCSV(candidates: Candidate[]): void {
    if (!candidates || candidates.length === 0) {
      console.warn('No candidates to export');
      return;
    }

    // CSV headers
    const headers = [
      'Name',
      'Title',
      'Location',
      'Experience',
      'Availability',
      'Technologies',
      'Skills',
      'Certifications',
      'Current Project',
      'Match Score'
    ];

    // Convert candidates to CSV rows
    const rows = candidates.map(candidate => [
      this.escapeCsvValue(candidate.name),
      this.escapeCsvValue(candidate.title),
      this.escapeCsvValue(candidate.location),
      this.escapeCsvValue(candidate.experience),
      this.escapeCsvValue(candidate.availability),
      this.escapeCsvValue(candidate.technologies?.join('; ') || ''),
      this.escapeCsvValue(candidate.skills?.join('; ') || ''),
      this.escapeCsvValue(candidate.certifications?.join('; ') || ''),
      this.escapeCsvValue(candidate.currentProject?.name || ''),
      this.formatMatchScore(candidate.matchScore.matched)
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Trigger download
    this.downloadFile(csvContent, this.generateFilename('csv'), 'text/csv');
  }

  /**
   * Export candidates to JSON format
   * Downloads file: pythia-candidates-{timestamp}.json
   */
  exportToJSON(candidates: Candidate[]): void {
    if (!candidates || candidates.length === 0) {
      console.warn('No candidates to export');
      return;
    }

    // Create export object with metadata
    const exportData = {
      exportDate: new Date().toISOString(),
      candidateCount: candidates.length,
      exportedBy: 'Pythia+ Talent Search',
      version: '1.0',
      candidates: candidates.map(c => ({
        id: c.id,
        name: c.name,
        title: c.title,
        location: c.location,
        experience: c.experience,
        availability: c.availability,
        technologies: c.technologies || [],
        skills: c.skills || [],
        certifications: c.certifications || [],
        currentProject: c.currentProject,
        matchScore: {
          percentage: Math.round(c.matchScore.matched * 100),
          value: c.matchScore.matched
        }
      }))
    };

    // Convert to formatted JSON
    const jsonContent = JSON.stringify(exportData, null, 2);

    // Trigger download
    this.downloadFile(jsonContent, this.generateFilename('json'), 'application/json');
  }

  /**
   * Escape CSV value (handle commas, quotes, newlines)
   */
  private escapeCsvValue(value: string | null | undefined): string {
    if (!value) return '';

    // If value contains comma, quote, or newline, wrap in quotes and escape internal quotes
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }

    return value;
  }

  /**
   * Format match score as percentage
   */
  private formatMatchScore(score: number): string {
    return `${Math.round(score * 100)}%`;
  }

  /**
   * Generate filename with timestamp
   */
  private generateFilename(extension: string): string {
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return `pythia-candidates-${timestamp}.${extension}`;
  }

  /**
   * Trigger browser download using Blob and URL.createObjectURL
   */
  private downloadFile(content: string, filename: string, mimeType: string): void {
    try {
      // Create blob
      const blob = new Blob([content], { type: mimeType });

      // Create object URL
      const url = URL.createObjectURL(blob);

      // Create temporary anchor element
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log(`Export successful: ${filename}`);
    } catch (error) {
      console.error('Export failed:', error);
      throw new Error('Failed to export file. Please try again.');
    }
  }
}
