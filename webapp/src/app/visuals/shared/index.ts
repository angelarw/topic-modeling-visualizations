export * from './node-visual/node-visual.component';
export * from './link-visual/link-visual.component';
export * from './legend-visual/legend-visual.component';

import { NodeVisualComponent } from './node-visual/node-visual.component';
import { LinkVisualComponent } from './link-visual/link-visual.component';
import { LegendVisualComponent } from "./legend-visual/legend-visual.component";

export const SHARED_VISUALS = [
  NodeVisualComponent,
  LinkVisualComponent,
  LegendVisualComponent,
];
