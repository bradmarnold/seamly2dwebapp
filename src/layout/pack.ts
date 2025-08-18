/**
 * Rectangle packing algorithm for pattern pieces
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { LayoutSettings } from './settings';

export interface Rectangle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number; // degrees
}

export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}

export interface LayoutPage {
  id: string;
  pieces: Rectangle[];
  bounds: BoundingBox;
  pageNumber: number;
}

export interface LayoutResult {
  pages: LayoutPage[];
  totalArea: number;
  efficiency: number; // percentage of paper used
  settings: LayoutSettings;
}

export class RectanglePacker {
  private settings: LayoutSettings;
  private pageWidth: number;
  private pageHeight: number;
  
  constructor(settings: LayoutSettings) {
    this.settings = settings;
    
    // Calculate usable page dimensions (minus margins)
    this.pageWidth = settings.paperSize.width - settings.margins.left - settings.margins.right;
    this.pageHeight = settings.paperSize.height - settings.margins.top - settings.margins.bottom;
  }
  
  pack(pieces: Rectangle[]): LayoutResult {
    // Sort pieces according to arrangement rule
    const sortedPieces = this.sortPieces(pieces);
    
    const pages: LayoutPage[] = [];
    let currentPagePieces: Rectangle[] = [];
    let currentY = 0;
    
    for (const piece of sortedPieces) {
      const { width, height } = this.getPieceDimensions(piece);
      
      // Try to place piece on current page
      const placement = this.findPlacement(currentPagePieces, width, height);
      
      if (placement && placement.y + height <= this.pageHeight) {
        // Fits on current page
        const placedPiece: Rectangle = {
          ...piece,
          x: placement.x + this.settings.margins.left,
          y: placement.y + this.settings.margins.top,
          width,
          height,
        };
        
        currentPagePieces.push(placedPiece);
        currentY = Math.max(currentY, placement.y + height);
      } else {
        // Start new page
        if (currentPagePieces.length > 0) {
          pages.push(this.createPage(currentPagePieces, pages.length + 1));
          currentPagePieces = [];
          currentY = 0;
        }
        
        // Place piece on new page
        const placedPiece: Rectangle = {
          ...piece,
          x: this.settings.margins.left,
          y: this.settings.margins.top,
          width,
          height,
        };
        
        currentPagePieces.push(placedPiece);
        currentY = height;
      }
    }
    
    // Add final page if it has pieces
    if (currentPagePieces.length > 0) {
      pages.push(this.createPage(currentPagePieces, pages.length + 1));
    }
    
    // Calculate efficiency
    const totalPieceArea = pieces.reduce((sum, p) => sum + (p.width * p.height), 0);
    const totalPageArea = pages.length * (this.pageWidth * this.pageHeight);
    const efficiency = totalPageArea > 0 ? (totalPieceArea / totalPageArea) * 100 : 0;
    
    return {
      pages,
      totalArea: totalPieceArea,
      efficiency,
      settings: this.settings,
    };
  }
  
  private sortPieces(pieces: Rectangle[]): Rectangle[] {
    const sortedPieces = [...pieces];
    
    switch (this.settings.arrangementRule) {
      case 'descending_area':
        sortedPieces.sort((a, b) => (b.width * b.height) - (a.width * a.height));
        break;
      case 'three_groups':
        // Large, medium, small groups
        sortedPieces.sort((a, b) => {
          const aArea = a.width * a.height;
          const bArea = b.width * b.height;
          return bArea - aArea;
        });
        break;
      case 'two_groups':
        // Large and small groups
        sortedPieces.sort((a, b) => {
          const aArea = a.width * a.height;
          const bArea = b.width * b.height;
          return bArea - aArea;
        });
        break;
    }
    
    return sortedPieces;
  }
  
  private getPieceDimensions(piece: Rectangle): { width: number; height: number } {
    let { width, height } = piece;
    
    // Apply rotation if enabled and beneficial
    if (this.settings.rotateWorkpiece && this.settings.rotateBy90) {
      // Check if rotation improves fit
      if (height > width && width <= this.pageWidth && height <= this.pageHeight) {
        // Keep original orientation
      } else if (width > height && height <= this.pageWidth && width <= this.pageHeight) {
        // Rotate 90 degrees
        [width, height] = [height, width];
      }
    }
    
    // Add gap
    const gap = this.settings.gapX2 ? this.settings.gapWidth * 2 : this.settings.gapWidth;
    width += gap;
    height += gap;
    
    return { width, height };
  }
  
  private findPlacement(placedPieces: Rectangle[], width: number, height: number): { x: number; y: number } | null {
    // Simple bottom-left placement algorithm
    
    // Try placing at origin first
    if (this.canPlaceAt(placedPieces, 0, 0, width, height)) {
      return { x: 0, y: 0 };
    }
    
    // Try placing next to existing pieces
    for (const piece of placedPieces) {
      // Try to the right of this piece
      const rightX = piece.x + piece.width - this.settings.margins.left;
      if (this.canPlaceAt(placedPieces, rightX, piece.y - this.settings.margins.top, width, height)) {
        return { x: rightX, y: piece.y - this.settings.margins.top };
      }
      
      // Try above this piece
      const topY = piece.y + piece.height - this.settings.margins.top;
      if (this.canPlaceAt(placedPieces, piece.x - this.settings.margins.left, topY, width, height)) {
        return { x: piece.x - this.settings.margins.left, y: topY };
      }
    }
    
    return null;
  }
  
  private canPlaceAt(placedPieces: Rectangle[], x: number, y: number, width: number, height: number): boolean {
    // Check if placement fits within page bounds
    if (x + width > this.pageWidth || y + height > this.pageHeight) {
      return false;
    }
    
    // Check for overlaps with existing pieces
    const testRect = { 
      id: 'test',
      x: x + this.settings.margins.left, 
      y: y + this.settings.margins.top, 
      width, 
      height,
      rotation: 0
    };
    
    for (const piece of placedPieces) {
      if (this.rectanglesOverlap(testRect, piece)) {
        return false;
      }
    }
    
    return true;
  }
  
  private rectanglesOverlap(a: Rectangle, b: Rectangle): boolean {
    return !(
      a.x + a.width <= b.x ||
      b.x + b.width <= a.x ||
      a.y + a.height <= b.y ||
      b.y + b.height <= a.y
    );
  }
  
  private createPage(pieces: Rectangle[], pageNumber: number): LayoutPage {
    const bounds = this.calculateBounds(pieces);
    
    return {
      id: `page-${pageNumber}`,
      pieces: [...pieces],
      bounds,
      pageNumber,
    };
  }
  
  private calculateBounds(pieces: Rectangle[]): BoundingBox {
    if (pieces.length === 0) {
      return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
    }
    
    let minX = pieces[0].x;
    let minY = pieces[0].y;
    let maxX = pieces[0].x + pieces[0].width;
    let maxY = pieces[0].y + pieces[0].height;
    
    for (const piece of pieces) {
      minX = Math.min(minX, piece.x);
      minY = Math.min(minY, piece.y);
      maxX = Math.max(maxX, piece.x + piece.width);
      maxY = Math.max(maxY, piece.y + piece.height);
    }
    
    return {
      minX,
      minY,
      maxX,
      maxY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }
}