import {createPopper, placements} from '../src/index';

function mountPair() {
  const reference = document.createElement('div');
  const popper = document.createElement('div');
  reference.getBoundingClientRect = () =>
    ({
      x: 100,
      y: 100,
      top: 100,
      left: 100,
      right: 200,
      bottom: 140,
      width: 100,
      height: 40,
      toJSON() {
        return {};
      },
    }) as DOMRect;
  popper.getBoundingClientRect = () =>
    ({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 80,
      bottom: 40,
      width: 80,
      height: 40,
      toJSON() {
        return {};
      },
    }) as DOMRect;
  document.body.append(reference, popper);
  return {reference, popper};
}

describe('popper compat', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('exposes the placement list Element Plus validates against', () => {
    expect(placements).toContain('bottom');
    expect(placements).toContain('top-start');
    expect(placements).toContain('auto');
  });

  test('createPopper writes popper styles and placement data', async () => {
    const {reference, popper} = mountPair();
    let seenPlacement = '';
    const instance = createPopper(reference, popper, {
      placement: 'bottom',
      modifiers: [
        {name: 'eventListeners', enabled: false},
        {name: 'flip', enabled: false},
        {
          name: 'computeStyles',
          options: {gpuAcceleration: false, adaptive: false},
        },
        {
          name: 'updateState',
          enabled: true,
          phase: 'write',
          requires: ['computeStyles'],
          fn: ({state}) => {
            seenPlacement = String(state.attributes.popper?.['data-popper-placement']);
            state.styles.popper!.width = `${state.rects.reference.width}px`;
          },
        },
      ],
    });

    const state = await instance.update();
    expect(seenPlacement).toBe('bottom');
    expect(state.styles.popper?.position).toBe('absolute');
    expect(state.styles.popper?.transform).toBe('');
    expect(String(state.styles.popper?.top)).toMatch(/px$/);
    expect(String(state.styles.popper?.left)).toMatch(/px$/);
    expect(state.styles.popper?.width).toBe('100px');
    expect(state.attributes.popper?.['data-popper-placement']).toBe('bottom');
    expect(Number.isFinite(state.modifiersData.popperOffsets.x)).toBe(true);
    expect(Number.isFinite(state.modifiersData.popperOffsets.y)).toBe(true);
    instance.destroy();
  });

  test('positions an arrow and can apply styles onto the element', async () => {
    const {reference, popper} = mountPair();
    const arrow = document.createElement('div');
    popper.append(arrow);
    const instance = createPopper(reference, popper, {
      placement: 'top',
      modifiers: [
        {name: 'eventListeners', enabled: false},
        {name: 'offset', options: {offset: [0, 12]}},
        {name: 'arrow', options: {element: arrow, padding: 4}},
        {name: 'computeStyles', options: {gpuAcceleration: true, adaptive: false}},
      ],
    });

    const state = await instance.update();
    expect(state.placement === 'top' || state.placement.startsWith('top')).toBe(true);
    expect(state.elements.arrow).toBe(arrow);
    expect(state.styles.arrow).toBeTruthy();
    expect(popper.getAttribute('data-popper-placement')).toBe(state.placement);
    instance.destroy();
  });

  test('setOptions replaces placement', async () => {
    const {reference, popper} = mountPair();
    const instance = createPopper(reference, popper, {
      placement: 'bottom',
      modifiers: [
        {name: 'eventListeners', enabled: false},
        {name: 'flip', enabled: false},
      ],
    });
    await instance.update();
    const state = await instance.setOptions({placement: 'right'});
    expect(state.placement).toBe('right');
    instance.destroy();
  });
});
