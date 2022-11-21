import './style.css';
import { Graph, Node, Edge } from './model/graphs/graph';
import { GraphRenderer } from './model/graphs/graph_renderer';
import {
  GraphAnimator,
  NodeMotion,
  NodeMouseDragging,
} from './model/graphs/graph_animator';

const graph = new Graph();
graph.addNodes([
  [0, 0],
  [0, 1],
  [1, 1],
  [1, 0],
]);
graph.addEdges([
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
]);

const graphRenderer = new GraphRenderer(graph);
graphRenderer.config.coordTransform = {
  scalar: 50,
  xOffset: 20,
  yOffset: 20,
};

const canvas = document.getElementById('canvas');
canvas.innerHTML = graphRenderer.renderSVG().innerHTML;