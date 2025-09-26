export {};

declare global {
  interface Window {
    smartsupp?: (...args: any[]) => void;
    _smartsupp?: any;
  }
}
