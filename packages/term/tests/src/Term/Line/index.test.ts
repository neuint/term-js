import Line from '@Term/Line';

describe('Line', () => {
  let container: Element;

  beforeAll(() => {
    window.getSelection = () => ({
      anchorNode: null,
      anchorOffset: 0,
      focusNode: null,
      focusOffset: 0,
      isCollapsed: false,
      rangeCount: 0,
      type: 'string',
      addRange: jest.fn(),
      collapse: jest.fn(),
      collapseToEnd: jest.fn(),
      collapseToStart: jest.fn(),
      containsNode: jest.fn(),
      deleteFromDocument: jest.fn(),
      empty: jest.fn(),
      extend: jest.fn(),
      getRangeAt: jest.fn(),
      removeAllRanges: jest.fn(),
      removeRange: jest.fn(),
      selectAllChildren: jest.fn(),
      setBaseAndExtent: jest.fn(),
      setPosition: jest.fn(),
      toString: jest.fn(),
    });
  });

  beforeEach(() => {
    container = document.createElement('div');
  });

  it('Renders label with default delimiter and custom label', () => {
    const line = new Line(container, { label: 'test' });
    const labels = container.querySelectorAll('.label > div');
    expect(container.querySelector('.label')).not.toBeNull();
    expect(labels.length).toBe(2);

    expect(labels[0].className).toBe('labelTextContainer');
    expect(labels[0].querySelector('.labelText')?.innerHTML).toBe('test');

    expect(labels[1].className).toBe('');
    expect(labels[1].querySelector('.labelText')?.innerHTML).toBe('&nbsp;');
  });

  it('Renders label with custom delimiter and label', () => {
    const line = new Line(container, { label: 'test', delimiter: '_' });
    const labels = container.querySelectorAll('.label > div');
    expect(container.querySelector('.label')).not.toBeNull();
    expect(labels.length).toBe(4);

    expect(labels[0].className).toBe('labelTextContainer');
    expect(labels[0].querySelector('.labelText')?.innerHTML).toBe('test');

    expect(labels[1].className).toBe('');
    expect(labels[1].querySelector('.labelText')?.innerHTML).toBe('&nbsp;');

    expect(labels[2].className).toBe('labelTextContainer');
    expect(labels[2].querySelector('.labelText')?.innerHTML).toBe('_');

    expect(labels[3].className).toBe('');
    expect(labels[3].querySelector('.labelText')?.innerHTML).toBe('&nbsp;');
  });

  it('Renders label with delimiter only', () => {
    const line = new Line(container, { delimiter: '_' });
    const labels = container.querySelectorAll('.label > div');
    expect(container.querySelector('.label')).not.toBeNull();
    expect(labels.length).toBe(2);

    expect(labels[0].className).toBe('labelTextContainer');
    expect(labels[0].querySelector('.labelText')?.innerHTML).toBe('_');

    expect(labels[1].className).toBe('');
    expect(labels[1].querySelector('.labelText')?.innerHTML).toBe('&nbsp;');
  });

  it('Renders label with custom delimiter only', () => {
    const line = new Line(container, { delimiter: '_' });
    const labels = container.querySelectorAll('.label > div');
    expect(container.querySelector('.label')).not.toBeNull();
    expect(labels.length).toBe(2);

    expect(labels[0].className).toBe('labelTextContainer');
    expect(labels[0].querySelector('.labelText')?.innerHTML).toBe('_');

    expect(labels[1].className).toBe('');
    expect(labels[1].querySelector('.labelText')?.innerHTML).toBe('&nbsp;');
  });

  it('Renders without label', () => {
    const line = new Line(container, { delimiter: '' });
    expect(container.querySelector('.label')).toBeNull();
  });

  it('Enables edit by default', () => {
    const line = new Line(container, { delimiter: '' });
    expect(container.querySelector('[contenteditable="true"]')).not.toBeNull();
  });

  it('Disables edit', () => {
    const line = new Line(container, { delimiter: '', editable: false });
    expect(container.querySelector('[contenteditable="true"]')).toBeNull();
  });

  it('Sets value in edit mode', () => {
    const line = new Line(container, { value: 'Test value' });
    expect(container.querySelector('[contenteditable="true"]')?.innerHTML)
      .toBe('Test&nbsp;value');
  });
});
