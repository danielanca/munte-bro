// src/client/components/AdminArea/ShardsDesign/flux/emitter.ts
type Handler = (...args: any[]) => void;

export default class Emitter {
  private map = new Map<string, Set<Handler>>();

  on(event: string, cb: Handler): void {
    if (!this.map.has(event)) this.map.set(event, new Set());
    this.map.get(event)!.add(cb);
  }

  removeListener(event: string, cb: Handler): void {
    this.map.get(event)?.delete(cb);
  }

  emit(event: string, ...args: any[]): void {
    this.map.get(event)?.forEach((cb) => cb(...args));
  }
}
