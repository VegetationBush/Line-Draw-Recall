import GameBoard from "./components/GameBoard"
import Leaderboard from "./components/Leaderboard"

function App() {
 
  return (
    <div style = {{
      overflow: "hidden",
      touchAction: "none",
      contain: "paint",
      display: "flex",
      gap: "2rem",
      justifyContent: "center",
      alignItems: "center",
    }}>
      <GameBoard/>
      <Leaderboard/>
    </div>
  )
}

export default App
