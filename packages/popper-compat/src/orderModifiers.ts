import type {ModifierPhases} from './types';
import type {ModifierObject} from './types';
import {modifierPhases} from './placements';

export function mergeByName(modifiers: Array<Partial<ModifierObject>>): ModifierObject[] {
  const merged: Record<string, ModifierObject> = {};

  modifiers.forEach((current) => {
    if (!current || !current.name) {
      return;
    }

    const existing = merged[current.name];
    const next: ModifierObject = {
      ...existing,
      ...current,
      name: current.name,
      options: {...existing?.options, ...current.options},
      data: {...existing?.data, ...current.data},
    };

    if (typeof current.fn !== 'function' && existing?.fn) {
      next.fn = existing.fn;
    }
    if (current.phase == null && existing?.phase) {
      next.phase = existing.phase;
    }
    if (current.enabled == null && existing) {
      next.enabled = existing.enabled;
    }
    if (current.effect == null && existing?.effect) {
      next.effect = existing.effect;
    }
    if (current.requires == null && existing?.requires) {
      next.requires = existing.requires;
    }
    if (current.requiresIfExists == null && existing?.requiresIfExists) {
      next.requiresIfExists = existing.requiresIfExists;
    }

    merged[current.name] = next;
  });

  return Object.keys(merged).map((key) => merged[key]!);
}

function sortByDependencies(modifiers: ModifierObject[]): ModifierObject[] {
  const map = new Map<string, ModifierObject>();
  const visited = new Set<string>();
  const result: ModifierObject[] = [];

  modifiers.forEach((modifier) => {
    map.set(modifier.name, modifier);
  });

  const visit = (modifier: ModifierObject) => {
    if (visited.has(modifier.name)) {
      return;
    }
    visited.add(modifier.name);

    const requires = [
      ...(modifier.requires || []),
      ...(modifier.requiresIfExists || []),
    ];

    requires.forEach((dependency) => {
      const next = map.get(dependency);
      if (next) {
        visit(next);
      }
    });

    result.push(modifier);
  };

  modifiers.forEach((modifier) => {
    visit(modifier);
  });

  return result;
}

export function orderModifiers(modifiers: ModifierObject[]): ModifierObject[] {
  const ordered = sortByDependencies(
    modifiers.map((modifier) => ({
      ...modifier,
      enabled: modifier.enabled !== false,
      phase: (modifier.phase || 'main') as ModifierPhases,
      fn: modifier.fn || (() => undefined),
    })),
  );

  return modifierPhases.reduce<ModifierObject[]>(
    (acc, phase) => acc.concat(ordered.filter((modifier) => modifier.phase === phase)),
    [],
  );
}
