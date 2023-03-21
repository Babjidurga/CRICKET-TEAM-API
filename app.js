const express = require("express");
const app = express();

const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

app.use(express.json());

let db = null;
const intializeDbServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is runnign at http://localhost:3000/");
    });
  } catch (error) {
    console.log(`error due to ${error.message}`);
    process.exit(1);
  }
};
intializeDbServer();
// 1. api to get the data
app.get("/players/", async (request, response) => {
  const playerData = "SELECT * FROM cricket_team;";
  const array = await db.all(playerData);
  response.send(array);
});
// 2. api to add the player
app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const playerDetails = `INSERT INTO cricket_team 
    (player_name,jersey_number,role) 
    VALUES ('${playerName}',${jerseyNumber},'${role}');`;
  await db.run(playerDetails);
  response.send("Player Added to Team");
});
// 3. To get the details of a given id Player
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = `SELECT * FROM cricket_team
    WHERE player_id = ${playerId};`;
  const dbResponse = await db.all(playerDetails);
  response.send(dbResponse);
});

// 4. To update the details of a player based on the ID
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayerDetails = `UPDATE cricket_team
    SET 
    player_name = '${playerName}',
    jersey_number = ${jerseyNumber},
    role = '${role}'
    WHERE player_id = ${playerId};`;
  await db.run(updatePlayerDetails);
  response.send("Player Detials Updated");
});

// 5.API to delete the player
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayer = `DELETE FROM cricket_team
    WHERE player_id = ${playerId};`;
  await db.run(deletePlayer);
  response.send("Player removed");
});

module.exports = app;
