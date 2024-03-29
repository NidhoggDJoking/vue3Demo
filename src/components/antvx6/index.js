import { Export } from "@antv/x6-plugin-export";

export function ExportJSON(graph) {
  graph.use(new Export());
}
