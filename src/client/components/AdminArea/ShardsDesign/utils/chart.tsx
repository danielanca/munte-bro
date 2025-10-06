// LineWithLine.tsx
// Chart.js v2-compatible TSX version that keeps the same name & export

import Chart from "chart.js";

(Chart as any).defaults.LineWithLine = (Chart as any).defaults.line;

(Chart as any).controllers.LineWithLine = (Chart as any).controllers.line.extend({
  draw(this: any, ease: any) {
    (Chart as any).controllers.line.prototype.draw.call(this, ease);

    const tooltip = this.chart?.tooltip;
    if (tooltip && Array.isArray(tooltip._active) && tooltip._active.length) {
      const activePoint = tooltip._active[0];
      const { ctx } = this.chart;
      const { x } = activePoint.tooltipPosition();

      // v2 scale key
      const yScale = this.chart.scales["y-axis-0"];
      if (!ctx || !yScale) return;

      const topY = yScale.top;
      const bottomY = yScale.bottom;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, topY);
      ctx.lineTo(x, bottomY);
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = "#ddd";
      ctx.stroke();
      ctx.restore();
    }
  },
});

export default Chart;
