import type { Expression, FillPaint, StyleFunction, Transition } from 'mapbox-gl';

export interface OutlinePaint {
  'fill-outfill-outline-color-transition'?: Transition;
  'fill-outline-opacity'?: number | StyleFunction | Expression;
  'fill-outline-opacity-transition'?: Transition;
  'fill-outline-color'?: string | StyleFunction | Expression;
  'fill-outline-color-transition'?: Transition;
  'fill-outline-translate'?: number[] | Expression;
  'fill-outline-translate-transition'?: Transition;
  'fill-outline-translate-anchor'?: 'map' | 'viewport';
  'fill-outline-width'?: number | StyleFunction | Expression;
  'fill-outline-width-transition'?: Transition;
  'fill-outline-gap-width'?: number | StyleFunction | Expression;
  'fill-outline-gap-width-transition'?: Transition;
  'fill-outline-offset'?: number | StyleFunction | Expression;
  'fill-outline-offset-transition'?: Transition;
  'fill-outline-blur'?: number | StyleFunction | Expression;
  'fill-outline-blur-transition'?: Transition;
  'fill-outline-dasharray'?: number[] | Expression;
  'fill-outline-dasharray-transition'?: Transition;
  'fill-outline-pattern'?: string | Expression;
  'fill-outline-pattern-transition'?: Transition;
  'fill-outline-gradient'?: Expression;
}

export type OutlinedFillPaint = FillPaint & OutlinePaint;
