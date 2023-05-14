import type { AnySourceData, CircleLayout, CirclePaint, FillLayout, AnyLayer, LineLayout, LinePaint } from 'mapbox-gl';
import type { OutlinedFillPaint } from './types/fill-outline';
import { CIRCLE_PROPS, FILL_PROPS, LINE_PROPS, OUTLINED_FILL_PROPS } from './types/paint-props';
import { convertFillOutlineToLine, filterObject } from './utils';

export type LayersOptions<T> = {
  fill?: T;
  fillOutline?: T;
  line?: T;
  circle?: T;
};

export type GeoJsonGroup = {
  id: string;
  source: string | AnySourceData;
  metadata?: any;
  minzoom?: number;
  maxzoom?: number;
  interactive?: boolean;
  layout?: CircleLayout & FillLayout & LineLayout;
  paint?: CirclePaint & OutlinedFillPaint & LinePaint;
  filters?: LayersOptions<any[]>;
};

export function createGeoJsonGroup(group: GeoJsonGroup): AnyLayer[] {
  let { source, id, paint, metadata, interactive, minzoom, maxzoom, filters } = group;
  if (minzoom === undefined) minzoom = 0;
  if (maxzoom === undefined) maxzoom = 20;
  if (interactive === undefined) interactive = false;
  if (metadata === undefined) metadata = {};
  if (paint === undefined) paint = {};
  const layers: AnyLayer[] = [
    {
      id: `${id}-fill`,
      type: 'fill',
      source,
      filter: filters?.fill ?? ['==', '$type', 'Polygon'],
      paint: paint && filterObject(FILL_PROPS, paint),
      metadata,
      interactive,
      minzoom,
      maxzoom,
    },
    {
      id: `${id}-fill-outline`,
      type: 'line',
      source,
      filter: filters?.fillOutline ?? ['==', '$type', 'Polygon'],
      paint: paint && convertFillOutlineToLine(filterObject(OUTLINED_FILL_PROPS, paint)),
      metadata,
      interactive,
      minzoom,
      maxzoom,
    },
    {
      id: `${id}-line`,
      type: 'line',
      source,
      filter: filters?.line ?? ['==', '$type', 'LineString'],
      paint: paint && filterObject(LINE_PROPS, paint),
      metadata,
      interactive,
      minzoom,
      maxzoom,
    },
    {
      id: `${id}-point`,
      type: 'circle',
      source,
      filter: filters?.circle ?? ['==', '$type', 'Point'],
      paint: paint && filterObject(CIRCLE_PROPS, paint),
      metadata,
      interactive,
      minzoom,
      maxzoom,
    },
  ];
  return layers;
}
