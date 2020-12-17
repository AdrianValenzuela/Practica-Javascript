export default class WorldCup {
    constructor (teams = [], config = {}) {
        this.name = "World Cup";
        this.config = {};
        this.setup(config); 
        this.groupStage = [];
        this.setupGroupStage(teams);
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


}