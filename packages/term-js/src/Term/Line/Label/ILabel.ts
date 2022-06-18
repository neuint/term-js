import ITemplateEngine from '../../TemplateEngine/ITemplateEngine';

export default interface ILabel extends ITemplateEngine {
  params: { label?: string; delimiter?: string };
}
