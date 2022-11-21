import { Graph, Node } from './graph';
import { GraphRenderer } from './graph_renderer';

export abstract class Motion {
  abstract evaluateFrame();
  abstract isDisposable();
}

export class NodeMotion {
  startTime: number;
  initialX: number;
  initialY: number;
  constructor(
    public node: Node,
    public targetX: number,
    public targetY: number,
    public duration: number
  ) {
    this.startTime = new Date().getTime();
    this.initialX = node.x;
    this.initialY = node.y;
  }

  evaluateFrame() {
    const currentTime = new Date().getTime();
    const progress = Math.min(
      (currentTime - this.startTime) / this.duration,
      1
    );
    this.node.x = this.initialX + progress * (this.targetX - this.initialX);
    this.node.y = this.initialY + progress * (this.targetY - this.initialY);

    this.node.x =
      this.initialX +
      (-(Math.cos(progress * Math.PI) - 1) / 2) *
        (this.targetX - this.initialX);
    this.node.y =
      this.initialY +
      (-(Math.cos(progress * Math.PI) - 1) / 2) *
        (this.targetY - this.initialY);
    console.log('evaluating frame: ' + this.node.x + ' , ' + this.node.y);
  }

  isDisposable() {
    const currentTime = new Date().getTime();
    const progress = (currentTime - this.startTime) / this.duration;
    return progress > 1;
  }
}

export class NodeMouseDragging {
  constructor(public node: Node, public graphAnimator: GraphAnimator) {}

  evaluateFrame() {
    this.node.x = this.graphAnimator.mouseX;
    this.node.y = this.graphAnimator.mouseY;
  }

  disposable = false;
  isDisposable() {
    return this.disposable;
  }
  dispose() {
    this.disposable = true;
  }
}

export class GraphAnimatorConfig {
  fps = 60;
  nodeClickTreshold = 0.3;
}

export class GraphAnimator {
  config: GraphAnimatorConfig = new GraphAnimatorConfig();

  constructor(
    public graphRenderer: GraphRenderer,
    public svgElement: HTMLElement
  ) {}

  private interval: number = null;
  start() {
    if (this.interval == null) {
      const animator = this;
      this.interval = setInterval(function () {
        animator.evaluateFrame();
        const svg = animator.graphRenderer.renderSVG([]);
        animator.svgElement.innerHTML = svg.innerHTML;
      }, 1000 / this.config.fps);

      window.onmousemove = function (e) {
        animator.updateMousePosition(e, animator);
      };
      window.onclick = function (e) {
        this;
      };
    }
  }
  stop() {
    if (this.interval != null) {
      clearInterval(this.interval);
    }
  }

  motions: Motion[] = [];

  addMotion(motion: Motion) {
    this.motions.push(motion);
  }

  mouseX: number = 0;
  mouseY: number = 0;
  count = 0;
  private updateMousePosition(e: MouseEvent, graphAnimator: GraphAnimator) {
    const canvasRect = this.svgElement.getBoundingClientRect();
    const scalar = this.graphRenderer.config.coordTransform.scalar;
    this.mouseX =
      (e.pageX -
        canvasRect.left -
        this.graphRenderer.config.coordTransform.xOffset) /
      scalar;
    this.mouseY =
      (e.pageY -
        canvasRect.top -
        this.graphRenderer.config.coordTransform.yOffset) /
      scalar;
  }

  onNodeClick: (node: Node) => void = function () {};

  setOnNodeClick(onNodeClick: (node: Node) => void) {
    this.onNodeClick = onNodeClick;
    const graphAnimator = this;
    window.onclick = function (e) {
      const threshold = graphAnimator.config.nodeClickTreshold;
      for (let node of graphAnimator.graphRenderer.graph.nodes) {
        if (
          Math.abs(node.x - graphAnimator.mouseX) < threshold &&
          Math.abs(node.y - graphAnimator.mouseY) < threshold
        ) {
          onNodeClick(node);
          break;
        }
      }
    };
  }

  private evaluateFrame() {
    let disposableMotions: Motion[] = [];
    for (let motion of this.motions) {
      if (motion.isDisposable()) {
        disposableMotions.push(motion);
      }
      motion.evaluateFrame();
    }
    this.motions = this.motions.filter(
      (motion) => disposableMotions.indexOf(motion) < 0
    );
  }
}
