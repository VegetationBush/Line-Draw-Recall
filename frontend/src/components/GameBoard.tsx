import { useEffect, useRef } from "react"

const CANVAS_SIZE = 100
function GameBoard() {
  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null); // for user draw
  const displayCanvasRef = useRef<HTMLCanvasElement | null>(null); // for prompt/answer

  useEffect(() => {
    const drawCanvas = drawCanvasRef.current;
    const displayCanvas = displayCanvasRef.current;

    if (!drawCanvas || !displayCanvas) return;

    const displayContext = displayCanvas.getContext("2d") as CanvasRenderingContext2D;
    displayContext.fillStyle = "purple";
    displayContext.fillRect(20, 20, 30, 30);

    const drawContext = drawCanvas.getContext("2d") as CanvasRenderingContext2D;
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