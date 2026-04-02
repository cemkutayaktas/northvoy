// Type declaration for Google Analytics gtag function
interface Window {
  gtag: (...args: unknown[]) => void;
  dataLayer: unknown[];
}
