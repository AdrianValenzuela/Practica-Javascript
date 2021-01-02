import WorldCup from "./classes/WorldCup.js"
import { Teams } from "./teams.js"

const worldCup = new WorldCup(Teams);

console.log("Grupos y equipos");
console.log("=========================");
printGroups();
console.log("=========================");
console.log("===COMIENZA EL MUNDIAL===");
console.log("=========================");
worldCup.startWorldCup();

i = 1;
    premier.summaries.forEach(summary => {
        console.log(`Resumen Jornada ${i}`);
        summary.results.forEach(result => {
            console.log(`${result.homeTeam} ${result.homeGoals} - ${result.awayTeam} ${result.awayGoals}`);
        });
        console.table(summary.standing.map(team => {
            return {
                Team: team.name,
                Points: team.points,
                PlayedMatches: team.matchesWon + team.matchesDrawn + team.matchesLost,
                Won: team.matchesWon,
                Drawn: team.matchesDrawn,
                Lost: team.matchesLost,
                GoalsFor: team.goalsFor,
                GoalsAgainst: team.goalsAgainst,
                GoalsDiff: team.goalsFor - team.goalsAgainst
            };
        }));
        i++;
    });



function printGroups() {
    let groupsIndex = 0;
    worldCup.groupStage.groups.forEach(group => {
        console.log("Grupo:", group.name);
        console.log("--------------");
        group.teams.forEach(team => {
            console.log(team.name);
        });
        console.log()
        let groupMatchIndex = 1;
        for (let j = groupsIndex; j < groupsIndex + 3; j++) {
            // sabemos que cada grupo son 3 jornadas
            const matchDay = worldCup.groupStage.matchSchedule[j];
            console.log(`Jornada ${groupMatchIndex}:`);
            matchDay.forEach(match => {
                console.log(match[0] + " VS " + match[1]);
            });
            groupMatchIndex++;
            console.log();
        }
        groupsIndex += 3;
    });
}