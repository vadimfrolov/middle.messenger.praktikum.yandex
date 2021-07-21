declare module '*.html' {
  const value: (props: Record<string, unknown>) => string;
  export default value;
}
