declare module '*.scss' {
  const content: {[className: string]: string};
  export default content;
}

declare module '*.html' {
  const content: string;
  export default content;
}
