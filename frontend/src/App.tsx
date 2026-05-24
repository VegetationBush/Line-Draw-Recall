import GameBoard from "./components/GameBoard"

function App() {
  return (
    <div style = {{
      overflow: "hidden",
      touchAction: "none",
      contain: "paint",
    }}>
      <GameBoard/>
    </div>
  )
}

export default App
