import ITemplateEngine from '@Term/TemplateEngine/ITemplateEngine';
export default interface ILabel extends ITemplateEngine {
    params: {
        label?: string;
        delimiter?: string;
    };
}
