import {
  getMarkedItems,
  GraphRenderer,
  GraphRendererConfig,
} from './graph_renderer';

export interface Position {
  x: number;
  y: number;
}

export class Node {
  constructor(public pos: Position) {}

  connectedEdges: Edge[] = [];

  addConnectedEdge(edge: Edge) {
    this.connectedEdges.push(edge);
  }

  calculateOrdinal() {
    return this.connectedEdges.length;
  }
}

export class Edge {
  constructor(public a: Node, public b: Node) {}
}

export class Graph {
  nodes: Node[] = [];
  edges: Edge[] = [];

  // nodes

  addNode(x: number, y: number) {
    return this.addNodeByPosition({ x, y });
  }
  addNodeByPosition(pos: Position) {
    const node = new Node(pos);
    this.nodes.push(node);
    return node;
  }

  addNodes(nodes: number[][]) {
    const nodesResult: Node[] = [];
    for (let nodeData of nodes) {
      if (nodeData.length === 2) {
        const node = this.addNode(nodeData[0], nodeData[1]);
        nodesResult.push(node);
      }
    }
    return nodesResult;
  }
  addNodesByPositions(positions: Position[]) {
    const nodesResult: Node[] = [];
    for (let pos of positions) {
      const node = this.addNodeByPosition(pos);
      nodesResult.push(node);
    }
    return nodesResult;
  }

  // edges

  addEdge(a: number, b: number) {
    const a_node = this.nodes[a];
    const b_node = this.nodes[b];
    const edge = new Edge(a_node, b_node);
    this.edges.push(edge);
    a_node.addConnectedEdge(edge);
    b_node.addConnectedEdge(edge);
    return edge;
  }

  addEdges(edges: number[][]) {
    const edgesResult: Edge[] = [];
    for (let edgeData of edges) {
      if (edgeData.length === 2) {
        const edge = this.addEdge(edgeData[0], edgeData[1]);
        edgesResult.push(edge);
      }
    }
    return edgesResult;
  }
}
