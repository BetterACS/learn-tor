import '@testing-library/jest-dom';

// Polyfill for matchMedia
interface MatchMediaResult {
    matches: boolean;
    media: string;
    onchange: ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null;
    addListener: (listener: (this: MediaQueryList, ev: MediaQueryListEvent) => any) => void;
    removeListener: (listener: (this: MediaQueryList, ev: MediaQueryListEvent) => any) => void;
    addEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void;
    removeEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void;
    dispatchEvent: (event: Event) => boolean;
}

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string): MatchMediaResult => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    }),
});

  