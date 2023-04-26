import { Map } from "mapbox-gl";
import type { AnyLayer } from 'mapbox-gl';
import { assign } from 'lodash-es';


declare module 'mapbox-gl' {
    export interface Map {
        /**
         * Add a layer group to the map.
         *
         * @param {Map} map
         * @param {string} id The id of the new group
         * @param {Array<Object>} layers The Mapbox style spec layers of the new group
         * @param {string} [beforeId] The layer id or group id after which the group
         *     will be inserted. If ommitted the group is added to the bottom of the
         *     style.
         */
        addLayerGroup(id: string, layers: mapboxgl.AnyLayer[], beforeId?: string): void;
        addLayerToGroup(id: string, layer: mapboxgl.AnyLayer, beforeId?: string, ignoreBeforeIdCheck?: boolean): void;
        removeGroup(id: string): void;
        moveGroup(id: string, beforeId: string): void;
    }

    export interface CustomLayerInterface {
        metadata?: any;
    }
}

Map.prototype.addLayerGroup = function(id: string, layers: AnyLayer[], beforeId: string) {
    var beforeLayerId = normalizeBeforeId(this, beforeId);
    for (var i = 0; i < layers.length; i++) {
        this.addLayerToGroup(id, layers[i], beforeLayerId, true);
    }
}

/**
 * Add a single layer to an existing layer group.
 *
 * @param {string} id The id of group
 * @param {AnyLayer} layer The Mapbox style spec layer
 * @param {string} [beforeId] An existing layer id after which the new layer
 *     will be inserted. If ommitted the layer is added to the bottom of
 *     the group.
 */
Map.prototype.addLayerToGroup = function(id: string, layer: AnyLayer, beforeId?: string, ignoreBeforeIdCheck?: boolean) {
    if (beforeId && !ignoreBeforeIdCheck && (!this.getLayer(beforeId) || getLayerGroup(this, beforeId) !== id)) {
        throw new Error('beforeId must be the id of a layer within the same group');
    } else if (!beforeId && !ignoreBeforeIdCheck) {
        beforeId = getGroupFirstLayerId(this, id);
    }

    var groupedLayer = assign({}, layer, {metadata: assign({}, layer.metadata || {}, {group: id})});
    this.addLayer(groupedLayer, beforeId);
}

/**
 * Remove a layer group and all of its layers from the map.
 *
 * @param {Map} map
 * @param {string} id The id of the group to be removed.
 */
Map.prototype.removeGroup = function(id: string) {
    var layers = this.getStyle().layers;
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].metadata?.group === id) {
            this.removeLayer(layers[i].id);
        }
    }
}

/**
 * Remove a layer group and all of its layers from the map.
 *
 * @param {string} id The id of the group to be moved.
 */
Map.prototype.moveGroup = function (id: string, beforeId: string) {
    var beforeLayerId = normalizeBeforeId(this, beforeId);

    var layers = this.getStyle().layers;
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].metadata?.group === id) {
            this.moveLayer(layers[i].id, beforeLayerId);
        }
    }
}

/**
 * Get the id of the first layer in a group.
 *
 * @param {Map} map
 * @param {string} id The id of the group.
 * @returns {string}
 */
function getGroupFirstLayerId(map: Map, id: string) {
    return getLayerIdFromIndex(map, getGroupFirstLayerIndex(map, id));
}

/**
 * Get the id of the last layer in a group.
 *
 * @param {Map} map
 * @param {string} id The id of the group.
 * @returns {string}
 */
export function getGroupLastLayerId(map: Map, id: string) {
    return getLayerIdFromIndex(map, getGroupLastLayerIndex(map, id));
}

function getGroupFirstLayerIndex(map: Map, id: string) {
    var layers = map.getStyle().layers;
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].metadata.group === id) return i;
    }
    return -1;
}

function getGroupLastLayerIndex(map: Map, id: string) {
    var layers = map.getStyle().layers;
    var i = getGroupFirstLayerIndex(map, id);
    if (i === -1) return -1;
    while (i < layers.length && (layers[i].id === id || layers[i].metadata.group === id)) i++;
    return i - 1;
}

function getLayerIdFromIndex(map: Map, index: number) {
    if (index === -1) return undefined;
    var layers = map.getStyle().layers;
    return layers[index] && layers[index].id;
}

function getLayerGroup(map: Map, id: string) {
    return map.getLayer(id).metadata.group;
}

function normalizeBeforeId(map: Map, beforeId: string) {
    if (beforeId && !map.getLayer(beforeId)) {
        return getGroupFirstLayerId(map, beforeId);
    } else if (beforeId && getLayerGroup(map, beforeId)) {
        return getGroupFirstLayerId(map, getLayerGroup(map, beforeId));
    } else {
        return beforeId;
    }
}