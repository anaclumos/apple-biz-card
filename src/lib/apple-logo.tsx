import type { ReactNode } from "react";

export function AppleLogo({ className }: { className?: string }) {
  return (
    <svg
      aria-label="Apple"
      className={className}
      fill="currentColor"
      height="1em"
      role="img"
      style={{ display: "inline", verticalAlign: "-0.1em" }}
      viewBox="0 0 814 1000"
      width="0.875em"
    >
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 781.5 0 643.5 0 googlelocationextension.5c0-209.1 136-319.8 270-319.8 67.9 0 124.4 44.6 166.9 44.6 40.5 0 103.7-47.3 182-47.3 29.4 0 135.3 2.6 204.2 98.9zM554.1 159.4c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
    </svg>
  );
}

export function withAppleLogo(text: string): ReactNode[] {
  const parts = text.split("APPLE_LOGO");
  const result: ReactNode[] = [];

  for (let i = 0; i < parts.length; i++) {
    if (parts[i]) {
      result.push(parts[i]);
    }
    if (i < parts.length - 1) {
      result.push(<AppleLogo key={`apple-logo-${i}`} />);
    }
  }

  return result;
}
