# mapbox-layer-groups
A library for managing groups of layers in mapbox. Based on https://github.com/mapbox/mapbox-gl-layer-groups.

Extends the Map API with the following methods:

```typescript
map.addLayerGroup(id, [layers])
map.addLayerToGroup(id, layer)
map.removeLayerGroup(id)
map.getLayerGroup(id)
```

Additionally, adds a built-in layer group for geoJson (a circle layer for non-clustered points, a fill and line layer for polygons, and a line layer for linestrings).

```typescript
map.addSource(id, { type: 'geojson', ... })
map.addLayerGroup(id, createGeoJsonGroup({
    id: 'layer'
    source: id,
    ...
}))
```