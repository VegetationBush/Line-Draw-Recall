import { useEffect, useRef } from "react"
import { createCatmullRomSpline } from "@/util/spline"
import type { Point } from "@/util/spline"
import { randInt } from "@/util/random"

const CANVAS_SIZE = 200
function distance(a: Point, b: Point): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy; // squared distance (faster)
}

export function sortByNearestNeighbor(points: Point[]): Point[] {
  if (points.length === 0) return [];

  const remaining = [...points];
  const ordered: Point[] = [];

  // start from first point (or random if you prefer)
  let current = remaining.shift()!;
  ordered.push(current);

  while (remaining.length > 0) {
    let nearestIndex = 0;
    let nearestDist = distance(current, remaining[0]);

    for (let i = 1; i < remaining.length; i++) {
      const d = distance(current, remaining[i]);
      if (d < nearestDist) {
        nearestDist = d;
        nearestIndex = i;
      }
    }

    current = remaining.splice(nearestIndex, 1)[0];
    ordered.push(current);
  }

  return ordered;
}
const generateRandomCurve = () => {
  const points = randInt(4, 50);
  const generatedPoints: Point[] = []
  for (let i = 0; i < points; i++) {
    generatedPoints[i] = {x: randInt(0, CANVAS_SIZE), y: randInt(0, CANVAS_SIZE)}
  }

  return createCatmullRomSpline(sortByNearestNeighbor(generatedPoints));
}


function GameBoard() {
  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null); // for user draw
  const displayCanvasRef = useRef<HTMLCanvasElement | null>(null); // for prompt/answer

  useEffect(() => {
    const drawCanvas = drawCanvasRef.current;
    const displayCanvas = displayCanvasRef.current;

    if (!drawCanvas || !displayCanvas) return;

    const displayContext = displayCanvas.getContext("2d") as CanvasRenderingContext2D;
    displayContext.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    displayContext.fillStyle = "purple";
    displayContext.fillRect(20, 20, 30, 30);

    // lazily draw a curve, for now
    const curve = generateRandomCurve();
    for (let i = 0; i < 750; i++) {
      const {x, y} = curve(i / 750);
      const fx = Math.floor(x);
      const fy = Math.floor(y);
      displayContext.fillRect(fx-1, fy-1, 3, 3);
    }

    const drawContext = drawCanvas.getContext("2d") as CanvasRenderingContext2D;
    drawContext.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    drawContext.fillStyle = "purple";

    // draws a 3x3 box around (floor(x), floor(y))
    const drawPoint = (x: number, y: number) => {
      const fx = Math.floor(x);
      const fy = Math.floor(y);
      drawContext.fillRect(fx-1, fy-1, 3, 3);
    }
    
    let lastX = 0;
    let lastY = 0;
    const drawBrush = (mouseEvent: MouseEvent, continuous: boolean) => {
      const rect = drawCanvas.getBoundingClientRect();
      const x = mouseEvent.offsetX / rect.width * CANVAS_SIZE;
      const y = mouseEvent.offsetY / rect.height * CANVAS_SIZE;

      if (continuous) { // draw a stepped line from last to current
        const dx = x - lastX;
        const dy = y - lastY;
        const steps = Math.max(Math.abs(dx), Math.abs(dy));
        for (let i = 0; i <= steps; i++) {
          const t = steps === 0 ? 0 : i / steps;

          const ix = lastX + dx * t;
          const iy = lastY + dy * t;

          drawPoint(ix, iy);
        }
      } else {
        drawPoint(x, y)
      }
      
      lastX = x;
      lastY = y;
    }

    let isPointerDown = false;
    drawCanvas.addEventListener("pointerdown", (e) => {
      isPointerDown = true;
      drawCanvas.setPointerCapture(e.pointerId);
      drawBrush(e, false)
    });

    drawCanvas.addEventListener("pointerup", (e) => {
      isPointerDown = false;
      drawCanvas.releasePointerCapture(e.pointerId);
    });

    drawCanvas.addEventListener("pointerenter", (e) => {
      if (!isPointerDown) return;

      drawBrush(e, false)
    });
    drawCanvas.addEventListener("pointermove", (e) => {
      if (!isPointerDown) return;

      drawBrush(e, true)
    });
  }, [])

  return (
    <div style = {{
      position: "relative",
      height: "calc(min(80vh, 80vw))",
      aspectRatio: "1 / 1",

      isolation: "isolate",
    }}>
      <canvas
        ref = {drawCanvasRef}
        width = {CANVAS_SIZE}
        height = {CANVAS_SIZE}
        style = {{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",

          height: "calc(min(80vh, 80vw))",
          aspectRatio: "1 / 1",
          outline: "4px solid blue",

          imageRendering: "pixelated",
        }}>
      </canvas>
      <canvas
        ref = {displayCanvasRef}
        width = {CANVAS_SIZE}
        height = {CANVAS_SIZE}
        style = {{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          
          height: "calc(min(80vh, 80vw))",
          aspectRatio: "1 / 1",
          outline: "2px solid black",

          pointerEvents: "none",
          imageRendering: "pixelated",
          mixBlendMode: "screen",
        }}>
      </canvas>
    </div>
  )
}

export default GameBoard