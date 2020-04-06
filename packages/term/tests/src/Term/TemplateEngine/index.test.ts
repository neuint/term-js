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

  it('Does not replace exist content on render with prepend', () => {
    const container = document.createElement('div');
    container.innerHTML = '<div class="className1 className2"></div>';
    const template = '<div class="test1"></div>';
    const te = new TemplateEngine(template, container);
    te.render({}, { append: false });
    expect(container.innerHTML)
      .toBe('<div class="test1"></div><div class="className1 className2"></div>');
  });

  it('Renders content before ref element', () => {
    const container = document.createElement('div');
    container.innerHTML = '<div class="className1 className2"></div>';
    const template = '<div class="className"></div>';
    const te1 = new TemplateEngine(template, container);
    const te2 = new TemplateEngine(template, container);
    const te3 = new TemplateEngine(template, container);
    te1.render({ css: { className: 'test1' } });
    te2.render({ css: { className: 'test2' } });
    te3.render({ css: { className: 'test3' } }, { append: false, ref: te1 });
    expect(container.innerHTML)
      .toBe('<div class="className1 className2"></div><div class="test3"></div><div class="test1"></div><div class="test2"></div>');
  });

  it('Replaces block from argument on render', () => {
    const container = document.createElement('div');
    container.innerHTML =
      '<div class="className1 className2"></div>';
    const template = '<div></div>';
    const replaceTe = new TemplateEngine(template, container);
    const te = new TemplateEngine(template, container);
    replaceTe.render({});
    te.render({}, { replace: replaceTe });
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

  it('Does not skip If block if condition is true with !', () => {
    const container = document.createElement('div');
    const template = '<If condition="{flag1 && !flag2}"><div>test</div></If>';
    const te = new TemplateEngine(template, container);
    te.render({
      flag1: true,
      flag2: false,
    });
    expect(container.innerHTML).toBe('<div>test</div>');
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

  it('Replaces variable in className', () => {
    const container = document.createElement('div');
    const template = '<div class="root {classNameTest}">test</div>';
    const te = new TemplateEngine(template, container);
    te.render({
      css: { root: 'test1' }, classNameTest: 'test2',
    });
    expect(container.innerHTML).toBe('<div class="test1 test2">test</div>');
  });

  it('Removes content from container on hide', () => {
    const container = document.createElement('div');
    const template = '<div class="root {classNameTest}">test</div>';
    container.innerHTML = '<div class="test"></div>';
    const te = new TemplateEngine(template, container);
    te.render({
      css: { root: 'test1' }, classNameTest: 'test2',
    });
    expect(container.innerHTML).toBe('<div class="test"></div><div class="test1 test2">test</div>');
    te.hide();
    expect(container.innerHTML).toBe('<div class="test"></div>');
  });

  it('Returns content to the container on show', () => {
    const container = document.createElement('div');
    const template = '<div class="root {classNameTest}">test</div>';
    container.innerHTML = '<div class="test"></div>';
    const te = new TemplateEngine(template, container);
    te.render({
      css: { root: 'test1' }, classNameTest: 'test2',
    });
    expect(container.innerHTML).toBe('<div class="test"></div><div class="test1 test2">test</div>');
    te.hide();
    expect(container.innerHTML).toBe('<div class="test"></div>');
    te.show();
    expect(container.innerHTML).toBe('<div class="test"></div><div class="test1 test2">test</div>');
  });
});
