// src/client/components/AdminArea/ShardsDesign/flux/dispatcher.ts
import type { FluxAction } from "./constants";

type Listener = (action: FluxAction) => void;

class SimpleDispatcher {
  private listeners = new Set<Listener>();

  register(cb: Listener): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  dispatch(action: FluxAction): void {
    for (const cb of Array.from(this.listeners)) cb(action);
  }
}

export default new SimpleDispatcher();
