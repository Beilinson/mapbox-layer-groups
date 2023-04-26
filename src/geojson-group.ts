import type { AnySourceData, CircleLayout, CirclePaint, FillLayout, Layer, LineLayout, LinePaint } from 'mapbox-gl';
import type { OutlinedFillPaint } from './types/fill-outline';
import { CIRCLE_PROPS, FILL_PROPS, LINE_PROPS, OUTLINED_FILL_PROPS } from './types/paint-props';
import { convertFillOutlineToLine, filterObject } from './utils';

export type GeoJsonGroup = {
  id: string;
  metadata?: any;
  source: string | AnySourceData;
  minzoom?: number;
  maxzoom?: number;
  interactive?: boolean;
  layout?: CircleLayout & FillLayout & LineLayout;
  paint?: CirclePaint & OutlinedFillPaint & LinePaint;
};

export function createGeoJsonGroup(group: GeoJsonGroup): Layer[] {
  let { source, id, paint, metadata, interactive, minzoom, maxzoom } = group;
  if (minzoom === undefined) minzoom = 0;
  if (maxzoom === undefined) maxzoom = 20;
  if (interactive === undefined) interactive = false;
  if (metadata === undefined) metadata = {};
  if (paint === undefined) paint = {};
  const layers: Layer[] = [
    {
      id: `${id}-fill`,
      type: 'fill',
      source,
      filter: ['==', '$type', 'Polygon'],
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
      filter: ['==', '$type', 'Polygon'],
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
      filter: ['==', '$type', 'LineString'],
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
      filter: ['all', ['==', '$type', 'Point'], ['!has', 'point_count']],
      paint: paint && filterObject(CIRCLE_PROPS, paint),
      metadata,
      interactive,
      minzoom,
      maxzoom,
    },
  ];
  return layers;
}
