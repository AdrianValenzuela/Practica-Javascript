import WorldCup from "./WorldCup.js";
import { Teams } from "../teams.js";

const worldCup = new WorldCup(Teams);

export default class Game {
    
    printGroups() {
        let i = 1;
        worldCup.groupStage.forEach(group => {
            console.log(`Grupo ${i}`);
            console.log("--------------");
            group.forEach(team => {
                console.log(team);
            });
            console.log()
            i++;
        });
    }

    printMatches() {
        let j = 1;
        worldCup.matchSchedule.forEach(matchDay => {
            console.log(`Jornada ${j}:`);
            matchDay.forEach(match => {
                console.log(match);
            });
            console.log();
            j++;
        });
    }
}