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
const graphAnimator = new GraphAnimator(
  graphRenderer,
  document.getElementById('canvas')
);
graphAnimator.setOnNodeClick(function (node: Node) {
  let success = false;
  for (let motion of graphAnimator.motions) {
    if (motion instanceof NodeMouseDragging) {
      const mouseDragging = motion as NodeMouseDragging;
      if (mouseDragging.node == node) {
        mouseDragging.dispose();
        success = true;
      }
    }
  }
  if (!success) {
    graphAnimator.addMotion(new NodeMouseDragging(node, graphAnimator));
  }
});
graphAnimator.start();

document.getElementById('animate_button').onclick = animate;
function animate() {
  graphAnimator.addMotion(new NodeMotion(graph.nodes[0], 0.5, 0.3, 500));
}

document.getElementById('stop_button').onclick = function () {
  graphAnimator.stop();
};
