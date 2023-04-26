import { LinePaint } from "mapbox-gl";
import { OutlinePaint, OutlinedFillPaint } from "./types/fill-outline";
import { LINE_PROPS } from "./types/paint-props";

export const filterObject = <TAllowed extends readonly any[], T extends Record<string, any>, TReturn extends T>(allowed: TAllowed, raw: T): TReturn => {
  return (Object.keys(raw) as readonly (keyof T)[])
    .filter((key) => allowed.includes(key))
    .reduce((obj, key) => {
      obj[key] = raw[key];
      return obj;
    }, {} as T) as TReturn;
};

export const isObjectEmpty = (obj: any): boolean =>  Object.keys(obj).length === 0;

export const convertFillOutlineToLine = (fillPaint: OutlinedFillPaint): LinePaint => {
    const linePaint: LinePaint = {};
    LINE_PROPS.forEach((key) => {
        const a = fillPaint[('fill-out' + key) as keyof OutlinePaint] as any;
        linePaint[key] = a;

    })
    return linePaint;
}