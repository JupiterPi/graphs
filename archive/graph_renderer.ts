import { Graph, Node, Edge } from '../graphs/graph';

export class GraphRendererConfig {
  coordTransform = {
    scalar: 1,
    xOffset: 0,
    yOffset: 0,
  };
  nodes = {
    radius: 5,
    fillColor: 'black',
    markedFillColor: 'red',
  };
  edges = {
    width: 2,
    color: 'black',
    markedColor: 'red',
  };

  applyCoordTransform(coord: number, axis: 'x' | 'y') {
    const offset =
      axis === 'x' ? this.coordTransform.xOffset : this.coordTransform.yOffset;
    return coord * this.coordTransform.scalar + offset;
  }

  insightLevels = {
    showOrdinals: true,
  };
  appearance = {
    ordinalLabels: {
      xOffset: -3,
      yOffset: 20,
    },
  };
}

export function getMarkedItems(selectedNodes: number[], nodes: Node[]) {
  const markedNodes: Node[] = [];
  for (let selectedNodeIndex of selectedNodes) {
    const node = nodes[selectedNodeIndex];
    markedNodes.push(node);
  }
  const markedEdges: Edge[] = [];
  for (let markedNode of markedNodes) {
    for (let connectedEdge of markedNode.connectedEdges) {
      markedEdges.push(connectedEdge);
    }
  }
  return {
    nodes: markedNodes,
    edges: markedEdges,
  };
}

export class GraphRenderer {
  config: GraphRendererConfig = new GraphRendererConfig();

  constructor(public graph: Graph) {}

  renderSVG(selectedNodes: number[] = []) {
    const markedItems = getMarkedItems(selectedNodes, this.graph.nodes);
    const svg = this.renderBaseSVG(selectedNodes);
    return this.annotateSVG(svg, markedItems);
  }

  private renderBaseSVG(selectedNodes: number[] = []) {
    const svg = document.createElement('svg');

    const markedItems = getMarkedItems(selectedNodes, this.graph.nodes);
    const markedNodes = markedItems.nodes;
    const markedEdges = markedItems.edges;

    for (let node of this.graph.nodes) {
      const svg_node = document.createElement('circle');
      svg_node.setAttribute(
        'cx',
        this.config.applyCoordTransform(node.x, 'x').toString()
      );
      svg_node.setAttribute(
        'cy',
        this.config.applyCoordTransform(node.y, 'y').toString()
      );
      svg_node.setAttribute('r', this.config.nodes.radius.toString());
      svg_node.setAttribute('fill', this.config.nodes.fillColor);

      if (markedNodes.indexOf(node) !== -1) {
        svg_node.setAttribute('fill', this.config.nodes.markedFillColor);
      }

      svg.appendChild(svg_node);
    }

    for (let edge of this.graph.edges) {
      const svg_edge = document.createElement('line');

      svg_edge.setAttribute(
        'x1',
        this.config.applyCoordTransform(edge.a.x, 'x').toString()
      );
      svg_edge.setAttribute(
        'y1',
        this.config.applyCoordTransform(edge.a.y, 'y').toString()
      );

      svg_edge.setAttribute(
        'x2',
        this.config.applyCoordTransform(edge.b.x, 'x').toString()
      );
      svg_edge.setAttribute(
        'y2',
        this.config.applyCoordTransform(edge.b.y, 'y').toString()
      );

      svg_edge.setAttribute(
        'style',
        'stroke: ' +
          this.config.edges.color +
          '; stroke-width: ' +
          this.config.edges.width.toString()
      );

      if (markedEdges.indexOf(edge) !== -1) {
        svg_edge.setAttribute(
          'style',
          'stroke: ' +
            this.config.edges.markedColor +
            '; stroke-width: ' +
            this.config.edges.width.toString()
        );
      }

      svg.appendChild(svg_edge);
    }

    return svg;
  }

  private annotateSVG(
    svg: HTMLElement,
    markedItems: { nodes: Node[]; edges: Edge[] }
  ) {
    const markedNodes = markedItems.nodes;
    const markedEdges = markedItems.edges;

    for (let node of this.graph.nodes) {
      if (this.config.insightLevels.showOrdinals) {
        const svg_label = document.createElement('text');
        svg_label.innerText = node.calculateOrdinal().toString();
        svg_label.setAttribute(
          'x',
          (
            this.config.applyCoordTransform(node.x, 'x') +
            this.config.appearance.ordinalLabels.xOffset
          ).toString()
        );
        svg_label.setAttribute(
          'y',
          (
            this.config.applyCoordTransform(node.y, 'y') +
            this.config.appearance.ordinalLabels.yOffset
          ).toString()
        );
        svg_label.setAttribute('fill', this.config.nodes.fillColor);

        if (markedNodes.indexOf(node) !== -1) {
          svg_label.setAttribute('fill', this.config.nodes.markedFillColor);
        }

        svg.appendChild(svg_label);
      }
    }

    return svg;
  }
}
