// src/client/components/AdminArea/ShardsDesign/flux/store.ts
import Emitter from "./emitter";
import Dispatcher from "./dispatcher";
import Constants, { type FluxAction } from "./constants";
import getSidebarNavItems from "../data/sidebar-nav-items";

export type SidebarItem = {
  title: string;
  to: string;
  htmlBefore?: string;
  htmlAfter?: string;
};

type StoreState = {
  menuVisible: boolean;
  navItems: SidebarItem[];
};

let _store: StoreState = {
  menuVisible: false,
  navItems: getSidebarNavItems() as SidebarItem[],
};

class Store extends Emitter {
  constructor() {
    super();
    Dispatcher.register(this.registerToActions);
  }

  private registerToActions = ({ actionType }: FluxAction) => {
    switch (actionType) {
      case Constants.TOGGLE_SIDEBAR:
        this.toggleSidebar();
        break;
      default:
        // no-op
        break;
    }
  };

  private toggleSidebar() {
    _store = { ..._store, menuVisible: !_store.menuVisible };
    this.emit(Constants.CHANGE);
  }

  // Public API
  getMenuState() { return _store.menuVisible; }
  getSidebarItems() { return _store.navItems; }

  addChangeListener(cb: () => void) { this.on(Constants.CHANGE, cb); }
  removeChangeListener(cb: () => void) { this.removeListener(Constants.CHANGE, cb); }
}

export default new Store();
