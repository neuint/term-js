export default interface ITemplateEngine {
  template: string;
  container?: Element;
  render(
    params?: {
      css?: { [key: string]: string },
      [p: string]: string | number | boolean | undefined | { [key: string]: string },
    },
  ): void;
  getRefMap(): { [name: string]: Element | undefined };
  getRef(name: string): Element | undefined;
  destroy(): void;
}
