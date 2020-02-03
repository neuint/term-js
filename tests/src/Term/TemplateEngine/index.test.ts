import TemplateEngine from '@Term/TemplateEngine';

describe('TemplateEngine', () => {
  it('Creates TemplateEngine with empty template', () => {
    const te = new TemplateEngine();
    expect(te.template).toBe('');
  });

  it('Creates TemplateEngine with template from constructor', () => {
    const te = new TemplateEngine('Test');
    expect(te.template).toBe('Test');
  });

  it('Does not render template to the undefined container', () => {
    const template = '<div class="test"></div>';
    const te = new TemplateEngine(template);
    te.render();
    expect(te.template).toBe('<div class="test"></div>');
    expect(te.container).toBeUndefined();
  });

  it('Does not render empty template to the container', () => {
    const container = document.createElement('div');
    const template = '';
    const te = new TemplateEngine(template, container);
    te.render();
    expect(te.template).toBe('');
    expect(te.container).toBe(container);
  });

  it('Renders template to the container', () => {
    const container = document.createElement('div');
    const template = '<div></div>';
    const te = new TemplateEngine(template, container);
    te.render();
    expect(container.innerHTML).toBe('<div></div>');
  });

  it('Renders template to the container with class list', () => {
    const container = document.createElement('div');
    const template = '<div class="test1 test2"></div>';
    const te = new TemplateEngine(template, container);
    te.render({
      css: {
        test1: 'className1',
        test2: 'className2',
      },
    });
    expect(container.innerHTML).toBe('<div class="className1 className2"></div>');
  });

  it('Does not replace exist content on render', () => {
    const container = document.createElement('div');
    container.innerHTML = '<div class="className1 className2"></div>';
    const template = '<div></div>';
    const te = new TemplateEngine(template, container);
    te.render();
    expect(container.innerHTML).toBe('<div class="className1 className2"></div><div></div>');
  });

  it('Replaces block from argument on render', () => {
    const container = document.createElement('div');
    container.innerHTML =
      '<div class="className1 className2"></div><div class="testReplace"></div>';
    const template = '<div></div>';
    const te = new TemplateEngine(template, container);
    te.render({}, container.querySelector('.testReplace') || undefined);
    expect(container.innerHTML).toBe('<div class="className1 className2"></div><div></div>');
  });

  it('Changes css classes correctly', () => {
    const container = document.createElement('div');
    const template = '<div class="test_"></div><div class="test2"></div>';
    const te = new TemplateEngine(template, container);
    te.render({
      css: {
        test_: 'test-class-name',
        test2: 'test-class-name-2',
      },
    });
    expect(container.innerHTML).toContain('class="test-class-name"');
    expect(container.innerHTML).toContain('class="test-class-name-2"');
  });

  it('Changes variable name to the value', () => {
    const container = document.createElement('div');
    const template = '<div>{test}</div><div>{test2}</div>';
    const te = new TemplateEngine(template, container);
    te.render({
      test: 'test-class-name',
      test2: 'test-class-name-2',
    });
    expect(container.innerHTML).toContain('<div>test-class-name</div>');
    expect(container.innerHTML).toContain('<div>test-class-name-2</div>');
  });

  it('Saves template refs', () => {
    const container = document.createElement('div');
    const template = '<div ref="ref1">{test}</div><div ref="ref2">{test2}</div>';
    const te = new TemplateEngine(template, container);
    te.render({
      test: 'test-class-name',
      test2: 'test-class-name-2',
    });
    expect(te.getRefMap().ref1?.innerHTML).toBe('test-class-name');
    expect(te.getRefMap().ref2?.innerHTML).toBe('test-class-name-2');
    expect(te.getRef('ref1')?.innerHTML).toBe('test-class-name');
    expect(te.getRef('ref2')?.innerHTML).toBe('test-class-name-2');
  });

  it('Skips If block if condition is false', () => {
    const container = document.createElement('div');
    const template = '<If condition="{flag1 && flag2}"><div>test</div></If>';
    const te = new TemplateEngine(template, container);
    te.render({
      flag1: true,
      flag2: false,
    });
    expect(container.innerHTML).toBe('');
  });

  it('Does not skip If block if condition is true', () => {
    const container = document.createElement('div');
    const template = '<If condition="{flag1 || flag2}"><div>test</div></If>';
    const te = new TemplateEngine(template, container);
    te.render({
      flag1: true,
      flag2: false,
    });
    expect(container.innerHTML).toBe('<div>test</div>');
  });

  it('Does not skip When block and skip Otherwise block in Choose if condition is true', () => {
    const container = document.createElement('div');
    const template = '<Choose><When condition="{flag}"><div>test</div></When><Otherwise><div>test-2</div></Otherwise></Choose>';
    const te = new TemplateEngine(template, container);
    te.render({
      flag: true,
    });
    expect(container.innerHTML).toBe('<div>test</div>');
  });

  it('Does not skip Otherwise block and skip When block in Choose if condition is false', () => {
    const container = document.createElement('div');
    const template = '<Choose><When condition="{flag}"><div>test</div></When><Otherwise><div>test-2</div></Otherwise></Choose>';
    const te = new TemplateEngine(template, container);
    te.render({
      flag: false,
    });
    expect(container.innerHTML).toBe('<div>test-2</div>');
  });
});
