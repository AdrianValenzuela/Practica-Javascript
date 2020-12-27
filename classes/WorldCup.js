export default class WorldCup {

    constructor (teams = [], config = {}) {
        this.name = "World Cup";
        this.config = {};
        this.setup(); 
        this.groupStage = {};
        this.setupGroupStage(teams);
        this.matchSchedule = [];
        this.setupMatchSchedule(this.groupStage);
    }

    setup() {
        this.config = {
            pointsPerWin: 3,
            pointsPerDraw: 1,
            pointsPerLose: 0
        };
    }

    setupGroupStage(teams) {
        const groupA = this.generateGroup(teams, 'A');
        const groupB = this.generateGroup(teams, 'B');
        const groupC = this.generateGroup(teams, 'C');
        const groupD = this.generateGroup(teams, 'D');
        const groupE = this.generateGroup(teams, 'E');
        const groupF = this.generateGroup(teams, 'F');
        const groupG = this.generateGroup(teams, 'G');
        const groupH = this.generateGroup(teams, 'H');

        const groups = [groupA, groupB, groupC, groupD,
                        groupE, groupF, groupG, groupH];

        this.groupStage = {
            groups: groups,
            matchSchedule: [],
            results: {}
        };
    }

    generateGroup(teams, name) {
        const group = {
            name: name,
            teams: []
        };
        let numberOfTeams = teams.length;
        for (let i = 0; i < 4; i++) {
            const randomIndex = Math.floor((Math.random() * numberOfTeams));
            group.teams.push(teams[randomIndex]);
            teams.splice(randomIndex, 1);
            numberOfTeams = teams.length;
        }

        return group;
    }

    setupMatchSchedule(groupStage) {
        for (let i = 0; i < groupStage.groups.length; i++) {
            const numberOfMatchDays = groupStage.groups[i].teams.length - 1;
            const numberOfMatchesPerMatchDay = groupStage.groups[i].teams.length / 2;
            this.generateMatchDays(numberOfMatchDays, numberOfMatchesPerMatchDay, groupStage.groups[i].teams);
        }
    }

    generateMatchDays(numberOfMatchDays, numberOfMatchesPerMatchDay, groupTeams) {
        let homeIndex = 0;
        let awayIndex = groupTeams.length - 2;
        for(let i = 0; i < numberOfMatchDays; i++) {
            const matchDay = []; // jornada vacía
            let firstMatch = true;

            for (let j = 0; j < numberOfMatchesPerMatchDay; j++) {
                matchDay.push(this.generateMatch(groupTeams, homeIndex, awayIndex, firstMatch));
                
                // hacemos un check de los indices y los modificamos
                if (firstMatch) {
                    firstMatch = false;
                }
                else {
                    awayIndex--;
                }
                
                homeIndex++;
                

                if (homeIndex > groupTeams.length - 2) {
                    homeIndex = 0;
                }

                if (awayIndex < 0) {
                    awayIndex = groupTeams.length - 2;
                }

            }

            this.groupStage.matchSchedule.push(matchDay);
        }
    }

    generateMatch(groupTeams, homeIndex, awayIndex, firstMatch) {
      // establecemos primer equipo del partido
      const match = [];
      let teamIndex = homeIndex;
      match[0] = groupTeams[teamIndex];

      //establecemos segundo equipo del partido
      if (firstMatch){
          // es el primer partido
          // establecemos como segundo equipo el último del array
          match[1] = groupTeams[groupTeams.length - 1];
      }
      else {
          // no es el primer partido
          teamIndex = awayIndex;
          match[1] = groupTeams[teamIndex];
      }
      

      return match;


    }
}