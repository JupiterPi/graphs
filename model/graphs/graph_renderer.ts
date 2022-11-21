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
  };
  edges = {
    width: 2,
    color: 'black',
  };

  applyCoordTransform(coord: number, axis: 'x' | 'y') {
    const offset =
      axis === 'x' ? this.coordTransform.xOffset : this.coordTransform.yOffset;
    return coord * this.coordTransform.scalar + offset;
  }
}

export class GraphRenderer {
  config: GraphRendererConfig = new GraphRendererConfig();

  constructor(public graph: Graph) {}

  renderSVG() {
    return this.renderBaseSVG();
  }

  private renderBaseSVG() {
    const svg = document.createElement('svg');

    for (let node of this.graph.nodes) {
      const svg_node = document.createElement('circle');
      svg_node.setAttribute(
        'cx',
        this.config.applyCoordTransform(node.pos.x, 'x').toString()
      );
      svg_node.setAttribute(
        'cy',
        this.config.applyCoordTransform(node.pos.y, 'y').toString()
      );
      svg_node.setAttribute('r', this.config.nodes.radius.toString());
      svg_node.setAttribute('fill', this.config.nodes.fillColor);

      svg.appendChild(svg_node);
    }

    for (let edge of this.graph.edges) {
      const svg_edge = document.createElement('line');

      svg_edge.setAttribute(
        'x1',
        this.config.applyCoordTransform(edge.a.pos.x, 'x').toString()
      );
      svg_edge.setAttribute(
        'y1',
        this.config.applyCoordTransform(edge.a.pos.y, 'y').toString()
      );

      svg_edge.setAttribute(
        'x2',
        this.config.applyCoordTransform(edge.b.pos.x, 'x').toString()
      );
      svg_edge.setAttribute(
        'y2',
        this.config.applyCoordTransform(edge.b.pos.y, 'y').toString()
      );

      svg_edge.setAttribute(
        'style',
        'stroke: ' +
          this.config.edges.color +
          '; stroke-width: ' +
          this.config.edges.width.toString()
      );

      svg.appendChild(svg_edge);
    }

    return svg;
  }
}
