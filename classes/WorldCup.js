export default class WorldCup {

    constructor (teams = [], config = {}) {
        this.name = "World Cup";
        this.config = {};
        this.setup(config); 
        this.groupStage = [];
        this.setupGroupStage(teams);
        this.matchSchedule = [];
        this.setupMatchSchedule(this.groupStage);
    }

    setup(config) {
        const defaultConfig = {
            rounds: 1,
            pointsPerWin: 3,
            pointsPerDraw: 1,
            pointsPerLose: 0
        };

        this.config = Object.assign(defaultConfig, config);
    }

    setupGroupStage(teams) {
        const groupA = this.generateGroup(teams);
        const groupB = this.generateGroup(teams);
        const groupC = this.generateGroup(teams);
        const groupD = this.generateGroup(teams);
        const groupE = this.generateGroup(teams);
        const groupF = this.generateGroup(teams);
        const groupG = this.generateGroup(teams);
        const groupH = this.generateGroup(teams);

        this.groupStage.push(groupA);
        this.groupStage.push(groupB);
        this.groupStage.push(groupC);
        this.groupStage.push(groupD);
        this.groupStage.push(groupE);
        this.groupStage.push(groupF);
        this.groupStage.push(groupG);
        this.groupStage.push(groupH);
    }

    generateGroup(teams) {
        const group = []
        let numberOfTeams = teams.length;
        for (let i = 0; i < 4; i++) {
            const randomIndex = Math.floor((Math.random() * numberOfTeams));
            group.push(teams[randomIndex]);
            teams.splice(randomIndex, 1);
            numberOfTeams = teams.length;
        }

        return group;
    }

    setupMatchSchedule(groupStage) {
        for (let i = 0; i < groupStage.length; i++) {
            const numberOfMatchDays = groupStage[i].length - 1;
            const numberOfMatchesPerMatchDay = groupStage[i].length / 2;
            this.generateMatchDays(numberOfMatchDays, numberOfMatchesPerMatchDay, groupStage[i]);
        }
    }

    generateMatchDays(numberOfMatchDays, numberOfMatchesPerMatchDay, groupTeams) {
        let matchNumber = 1;
        for(let i = 0; i < numberOfMatchDays; i++) {
            const matchDay = []; // jornada vacía

            for (let j = 0; j < numberOfMatchesPerMatchDay; j++) {
                matchDay.push(this.generateMatch(groupTeams, matchNumber));
                matchNumber++;
            }

            this.matchSchedule.push(matchDay);
        }
    }

    generateMatch(groupTeams, matchNumber) {
        switch(matchNumber){
            case 1:
                return [groupTeams[0], groupTeams[1]];
                break;
            case 2:
                return [groupTeams[2], groupTeams[3]];
                break;
            case 3:
                return [groupTeams[1], groupTeams[2]];
                break;
            case 4:
                return [groupTeams[3], groupTeams[0]];
                break;
            case 5:
                return [groupTeams[1], groupTeams[3]];
                break;
            case 6:
                return [groupTeams[0], groupTeams[2]];
                break;
        }        
    }
}