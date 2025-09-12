import React, { LazyExoticComponent } from "react";
import { LoadableComponent } from "@loadable/component";

type LayoutType = LazyExoticComponent<React.ComponentType<any>> | React.ComponentType<any> | null;
type ComponentType = LazyExoticComponent<React.ComponentType<any>> | React.ComponentType<any>;

export interface RouteType {
  path: string;
  component: ComponentType;
  layout?: LayoutType;
  props?: Record<string, any>;
  children?: RouteType[];
  index?: boolean;
}

export type publicRoutesType = RouteType[];
