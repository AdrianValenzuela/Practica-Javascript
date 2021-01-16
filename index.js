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
console.log();
worldCup.getClassificatedTeams();
worldCup.setupEliminatorySchedule(worldCup.playOff);
console.log("=== OCTAVOS DE FINAL ===");
worldCup.playRound();
console.log();
console.log("=== CUARTOS DE FINAL ===");
worldCup.playRound();
console.log();
console.log("=== SEMIFINALES ===");
const fourLastTeams = getFourLastTeams();
worldCup.playRound();
console.log();
console.log("=== TERCER Y CUARTO PUESTO ===");
const match = getTeamsDecideThirdPlace(fourLastTeams);
worldCup.playThirdPlaceMatch(match);
console.log();
console.log("=== FINAL ===");
worldCup.playRound();
console.log();
console.log("=====================================");
console.log(`${worldCup.eliminatorySchedule[0].homeTeam} campeón del mundo!`);
console.log("=====================================");




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

function getFourLastTeams() {
    const fourLastTeams = worldCup.eliminatorySchedule.map(team => team.homeTeam);
    worldCup.eliminatorySchedule.map(team => team.awayTeam).forEach(team => {
        fourLastTeams.push(team);
    });

    return fourLastTeams;
}

function getTeamsDecideThirdPlace(fourLastTeams) {
    const match = [];
    const finalistTeams = worldCup.eliminatorySchedule.map(team => team.homeTeam);
    worldCup.eliminatorySchedule.map(team => team.awayTeam).forEach(team => {
        finalistTeams.push(team);
    });

    for (const team of fourLastTeams) {
        if (!finalistTeams.includes(team)) {
            match.push(team);
        }
    }

    return match;
}