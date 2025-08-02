// Performance utilities for GPU acceleration and smooth UI interactions

/**
 * Enable GPU acceleration for an element
 */
export const enableGPUAcceleration = (element: HTMLElement): void => {
  element.style.transform = 'translateZ(0)';
  element.style.backfaceVisibility = 'hidden';
  element.style.willChange = 'transform';
};

/**
 * Enable GPU acceleration for multiple elements
 */
export const enableGPUAccelerationForElements = (selectors: string[]): void => {
  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      if (element instanceof HTMLElement) {
        enableGPUAcceleration(element);
      }
    });
  });
};

/**
 * Check if GPU acceleration is supported
 */
export const isGPUAccelerationSupported = (): boolean => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  return !!gl;
};

/**
 * Force a repaint to ensure GPU acceleration is applied
 */
export const forceRepaint = (element: HTMLElement): void => {
  // Trigger a repaint by reading a property that forces layout
  element.offsetHeight;
};

/**
 * Optimize scroll performance for an element
 */
export const optimizeScrollPerformance = (element: HTMLElement): void => {
  element.style.transform = 'translateZ(0)';
  element.style.backfaceVisibility = 'hidden';
  element.style.willChange = 'scroll-position';
  // For iOS
  (element.style as any).webkitOverflowScrolling = 'touch';
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function for performance optimization
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Monitor frame rate for performance debugging
 */
export class FrameRateMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 0;
  private isRunning = false;

  start(): void {
    this.isRunning = true;
    this.monitor();
  }

  stop(): void {
    this.isRunning = false;
  }

  getFPS(): number {
    return this.fps;
  }

  private monitor = (): void => {
    if (!this.isRunning) return;

    this.frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - this.lastTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
      this.frameCount = 0;
      this.lastTime = currentTime;
      
      // Log FPS for debugging (remove in production)
      if (this.fps < 30) {
        console.warn(`Low FPS detected: ${this.fps}`);
      }
    }

    requestAnimationFrame(this.monitor);
  };
}

/**
 * Initialize GPU acceleration for the entire application
 */
export const initializeGPUAcceleration = (): void => {
  // Enable GPU acceleration for body
  if (document.body) {
    enableGPUAcceleration(document.body);
  }

  // Enable GPU acceleration for common elements
  enableGPUAccelerationForElements([
    '.app',
    '.virtualized-table',
    '.virtual-header',
    '.virtual-row',
    '.virtual-cell',
    '.loading-overlay',
    '.analysis-panel',
    '.details-sidebar'
  ]);

  // Add GPU acceleration class to document
  document.documentElement.classList.add('gpu-accelerated');

  // Force repaint to ensure acceleration is applied
  if (document.body) {
    forceRepaint(document.body);
  }
};

/**
 * Optimize virtual scrolling performance
 */
export const optimizeVirtualScrolling = (container: HTMLElement): void => {
  // Enable hardware acceleration for scroll container
  container.style.transform = 'translateZ(0)';
  container.style.backfaceVisibility = 'hidden';
  container.style.willChange = 'scroll-position';
  
  // Optimize scroll performance
  optimizeScrollPerformance(container);
  
  // Force repaint
  forceRepaint(container);
}; 