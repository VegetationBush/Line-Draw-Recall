import { useEffect, useState } from "react"
import axios from "axios"
import type { LeaderboardResponse } from "@line-draw-recall/shared"

function Leaderboard() {
  const [ leaderboard, setLeaderboard ] = useState<LeaderboardResponse | null>(null);
  useEffect(() => {
    const connection = axios.create();
    const query = async function() {
      const { data } = await connection.get<LeaderboardResponse>('http://localhost:3000/leaderboard');
      setLeaderboard(data);
      console.log(data);
    }
    query()
  }, [])

  return (
    <div style = {{
      position: "relative",
      height: "calc(100vh - 3rem)",
      width: "50rem",
      top: "1.5rem",

      backgroundColor: "orange",
    }}>
      Leaderboard

      {
        leaderboard && <div style = {{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}>
          {
            leaderboard.entries.map((item, index) => {
              return (<div key = {index}>
                {item.name + " " + item.score}
              </div>)
            })
          }
        </div>
      }
    </div>
  )
}

export default Leaderboard