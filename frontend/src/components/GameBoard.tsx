import { useEffect, useRef } from "react"

const CANVAS_SIZE = 100
function GameBoard() {
  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const drawCanvas = drawCanvasRef.current

    if (!drawCanvas) return;

    const drawContext = drawCanvas.getContext("2d") as CanvasRenderingContext2D;
    drawContext.fillStyle = "white"

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

    let isDrawing = false

    drawCanvas.addEventListener("mousemove", (e) => {
      if (!isDrawing) return;

      drawBrush(e, true)
    });

    window.addEventListener("mousedown", (e) => {
      isDrawing = true;

      drawBrush(e, false)
    });
    window.addEventListener("mouseup", () => {
      isDrawing = false;
    });
  }, [])

  return (
    <div style = {{
      display: "flex",

      alignItems: "center",
      justifyContent: "center",

      height: "100vh",
      width: "100vw",

      backgroundColor: "white",
    }}>
      <canvas
        ref = {drawCanvasRef}
        width = {CANVAS_SIZE}
        height = {CANVAS_SIZE}
        style = {{
          height: "calc(min(80vh, 80vw))",
          aspectRatio: "1 / 1",
          backgroundColor: "black",
          color: "white",

          imageRendering: "pixelated",
        }}>
      </canvas>
    </div>
  )
}

export default GameBoard