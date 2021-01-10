import WorldCup from "./classes/WorldCup.js"
import { Teams } from "./teams.js"

const worldCup = new WorldCup(Teams);

console.log("Grupos y equipos");
console.log("=========================");
printGroups();
console.log("===========================");
console.log("=== COMIENZA EL MUNDIAL ===");
console.log("===========================");
console.log();
worldCup.startWorldCup();
printMatchesAndStanding();
console.log("=====================================");
console.log("=== COMIENZA LA FASE ELIMINATORIA ===");
console.log("=====================================");
worldCup.getClassificatedTeams();


function printGroups() {
    worldCup.groupStage.forEach(group => {
        console.log("Grupo:", group.groupName);
        console.log("--------------");
        group.teams.forEach(team => {
            console.log(team.name);
        });
        console.log()

        let index = 1;

        group.matchSchedule.forEach(matchDay => {
            console.log(`Jornada ${index}:`);
            matchDay.forEach(match => {
                console.log(match[0] + " VS " + match[1]);
            });
            console.log();
            index++;
        });
    });
}

function printMatchesAndStanding() {
    const groupNames = worldCup.groupStage.map(group => group.groupName)

    for (let i = 1; i <= 3; i++) {// numero de jornadas para cada grupo
        for (let j = 0; j < groupNames.length; j++) {
            console.log(`Grupo ${groupNames[j]} - Jornada ${i}:`);
            console.log("--------------");
            const matchDaySummary = worldCup.filterSummaryByGroupNameAndMatchDay(groupNames[j], i)
            matchDaySummary.matchDaySummary.results.forEach(result => {
                console.log(`${result.homeTeam} ${result.homeGoals} - ${result.awayTeam} ${result.awayGoals}`);
            });
            console.table(matchDaySummary.matchDaySummary.standing.map(stand => {
                return {
                    Equipo: stand.name,
                    Puntos: stand.points,
                    GolesMarcados: stand.goalsFor,
                    GolesRecibidos: stand.goalsAgainst,
                    DiferenciaGoles: stand.goalsFor - stand.goalsAgainst
                };
            }));
        }
    }
}