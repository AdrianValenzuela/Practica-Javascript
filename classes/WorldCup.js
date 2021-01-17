export default class WorldCup {

    constructor(teams) {
        this.name = "World Cup";
        this.config = {};
        this.setup();
        this.groupStage = [];
        this.setupGroupStage(teams);
        this.setupMatchSchedule(this.groupStage);
        this.summaries = [];
        this.playOff = [];
        this.eliminatorySchedule = [];
    }

    setup() {
        this.config = {
            pointsPerWin: 3,
            pointsPerDraw: 1,
            pointsPerLose: 0
        };
    }

    setupTeams(name) {
        return {
            name: name,
            matchesWon: 0,
            matchesDrawn: 0,
            matchesLost: 0,
            points: 0,
            goalsFor: 0,
            goalsAgainst: 0
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

        for (const group of groups) {
            const stage = {
                groupName: group.name,
                teams: group.teams,
                matchSchedule: [],
                results: {}
            };

            this.groupStage.push(stage);
        }
    }

    generateGroup(teams, name) {
        const group = {
            name: name,
            teams: []
        };

        let numberOfTeams = teams.length;
        for (let i = 0; i < 4; i++) {
            const randomIndex = Math.floor((Math.random() * numberOfTeams));
            const team = this.setupTeams(teams[randomIndex]);
            group.teams.push(team);
            teams.splice(randomIndex, 1);
            numberOfTeams = teams.length;
        }

        return group;
    }

    setupMatchSchedule(groupStage) {
        for (const group of groupStage) {
            const numberOfMatchDays = group.teams.length - 1;
            const numberOfMatchesPerMatchDay = group.teams.length / 2;

            this.generateMatchDays(numberOfMatchDays, numberOfMatchesPerMatchDay, group.teams, group.groupName);
        }
    }

    generateMatchDays(numberOfMatchDays, numberOfMatchesPerMatchDay, groupTeams, groupName) {
        let homeIndex = 0;
        let awayIndex = groupTeams.length - 2;
        for (let i = 0; i < numberOfMatchDays; i++) {
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

            this.groupStage.map(group => {
                if (group.groupName == groupName) {
                    group.matchSchedule.push(matchDay)
                }
            });
        }
    }

    generateMatch(groupTeams, homeIndex, awayIndex, firstMatch) {
        // establecemos primer equipo del partido
        const match = [];
        let teamIndex = homeIndex;
        match[0] = groupTeams[teamIndex].name;

        //establecemos segundo equipo del partido
        if (firstMatch) {
            // es el primer partido
            // establecemos como segundo equipo el último del array
            match[1] = groupTeams[groupTeams.length - 1].name;
        }
        else {
            // no es el primer partido
            teamIndex = awayIndex;
            match[1] = groupTeams[teamIndex].name;
        }

        return match;
    }

    startWorldCup() {
        this.groupStage.forEach(group => {
            let index = 1;
            for (const matchDay of group.matchSchedule) {
                const matchDaySummary = {
                    results: [],
                    standing: undefined
                };

                for (const match of matchDay) {
                    var result = this.playMatch(match);
                    this.updateTeams(result, group.groupName);
                    matchDaySummary.results.push(result);
                }

                this.getStanding(group.groupName);
                matchDaySummary.standing = this.groupStage.find(GROUP => GROUP.groupName == group.groupName).teams.map(team => Object.assign({}, team));

                const summary = {
                    groupName: group.groupName,
                    matchDay: index,
                    matchDaySummary: matchDaySummary
                };

                this.summaries.push(summary);
                index++;
            }
        });
    }

    playMatch(match) {
        const homeGoals = this.generateGoals();
        const awayGoals = this.generateGoals();
        return {
            homeTeam: match[0],
            homeGoals: homeGoals,
            awayTeam: match[1],
            awayGoals: awayGoals
        };
    }

    updateTeams(result, groupName) {
        const homeTeam = this.filterTeamByGroupNameAndTeamName(groupName, result.homeTeam);
        const awayTeam = this.filterTeamByGroupNameAndTeamName(groupName, result.awayTeam);

        if (homeTeam && awayTeam) {
            homeTeam.goalsFor += result.homeGoals;
            homeTeam.goalsAgainst += result.awayGoals;
            awayTeam.goalsFor += result.awayGoals;
            awayTeam.goalsAgainst += result.homeGoals;

            if (result.homeGoals > result.awayGoals) {
                // gana equipo local
                homeTeam.points += this.config.pointsPerWin;
                homeTeam.matchesWon += 1;
                awayTeam.points += this.config.pointsPerLose;
                awayTeam.matchesLost += 1;
            }
            else if (result.homeGoals < result.awayGoals) {
                // gana equipo visitante
                awayTeam.points += this.config.pointsPerWin;
                awayTeam.matchesWon += 1;
                homeTeam.points += this.config.pointsPerLose;
                homeTeam.matchesLost += 1;
            }
            else {
                // empate
                homeTeam.points += this.config.pointsPerDraw;
                homeTeam.matchesDrawn += 1;
                awayTeam.points += this.config.pointsPerDraw;
                awayTeam.matchesDrawn += 1;
            }
        }
    }

    getStanding(groupName) {
        const group = this.groupStage.filter(group => group.groupName == groupName);
        group[0].teams.sort(function (teamA, teamB) {
            if (teamA.points > teamB.points) {
                return -1;
            }
            else if (teamA.points < teamB.points) {
                return 1;
            }
            else {
                const goalsDiffA = teamA.goalsFor - teamA.goalsAgainst;
                const goalsDiffB = teamB.goalsFor - teamB.goalsAgainst;

                if (goalsDiffA > goalsDiffB) {
                    return -1;
                }
                else if (goalsDiffA < goalsDiffB) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
        });
    }

    getClassificatedTeams() {
        const groups = ["A", "B", "C", "D", "E", "F", "G", "H"];

        for (const group of groups) {
            const lastGroupSummary = this.filterSummaryByGroupNameAndMatchDay(group, 3); // el último resumen tiene el total de puntos de cada grupo.
            this.getTeamsClassificatedByGroup(group, lastGroupSummary.matchDaySummary.standing, this.summaries);
        }
    }

    getTeamsClassificatedByGroup(group, standing, Summaries) {
        standing.sort(function (teamA, teamB) {
            if (teamA.points > teamB.points) {
                return -1;
            }
            else if (teamA.points < teamB.points) {
                return 1
            }
            else {
                // empatan a puntos
                const summaries = Summaries.filter(summary => summary.groupName == group);

                for (const summary of summaries) {
                    const match = summary.matchDaySummary.results.filter(match => (match.homeTeam == teamA.name && match.awayTeam == teamB.name) ||
                        (match.homeTeam == teamB.name && match.awayTeam == teamA.name));

                    if (match.length != 0) {
                        // ha encontrado partido
                        if (match[0].homeGoals > match[0].awayGoals) {
                            // teamA ganó el partido directo
                            return -1;
                        }
                        else if (match[0].homeGoals < match[0].awayGoals) {
                            // teamB ganó el partido directo
                            return 1;
                        }
                        else {
                            // empatan el partido directo
                            if ((teamA.goalsFor - teamA.goalsAgainst) < (teamB.goalsFor - teamB.goalsAgainst)) {
                                // teamA tiene menor diferencia de goles, por lo tanto gana
                                return -1;
                            }
                            else if ((teamA.goalsFor - teamA.goalsAgainst) > (teamB.goalsFor - teamB.goalsAgainst)) {
                                // teamB tiene menor diferencia de goles, por lo tanto gana
                                return 1;
                            }
                            else {
                                // empatan el partido y la diferencia de goles es la misma
                                const teams = [teamA.name, teamB.name]
                                teams.sort();

                                if (teams[0] == teamA.name) {
                                    return -1;
                                }
                                else {
                                    return 1;
                                }
                            }
                        }
                    }
                }
            }
        });
        const classificatedTeams = {
            group: group,
            firstPlace: standing[0].name,
            secondPlace: standing[1].name
        }

        this.playOff.push(classificatedTeams);
    }

    setupEliminatorySchedule(playoff) {
        const firstTeamsABCD = this.filterClassificatedTeamByGroupAndPlace(["A", "B", "C", "D"], "first");
        const secondTeamsEFGH = this.filterClassificatedTeamByGroupAndPlace(["E", "F", "G", "H"], "second");
        const firstTeamsEFGH = this.filterClassificatedTeamByGroupAndPlace(["E", "F", "G", "H"], "first");
        const secondTeamsABCD = this.filterClassificatedTeamByGroupAndPlace(["A", "B", "C", "D"], "second");

        for (let i = 0; i < firstTeamsABCD.length; i++) {
            const match = {
                homeTeam: firstTeamsABCD[i],
                homeGoals: 0,
                awayTeam: secondTeamsEFGH[i],
                awayGoals: 0
            };

            this.eliminatorySchedule.push(match);
        }

        for (let i = 0; i < firstTeamsEFGH.length; i++) {
            const match = {
                homeTeam: firstTeamsEFGH[i],
                homeGoals: 0,
                awayTeam: secondTeamsABCD[i],
                awayGoals: 0
            };

            this.eliminatorySchedule.push(match);
        }
    }

    playRound() {
        const classificatedTeams = [];
        const newEliminatorySchedule = [];
        let winnerTeam = "";
        for (const match of this.eliminatorySchedule) {
            let result = this.playMatch([match.homeTeam, match.awayTeam]);
            while (result.homeGoals == result.awayGoals) {
                // en caso de empate volver a jugar
                result = this.playMatch([match.homeTeam, match.awayTeam]);
            }           

            if (result.homeGoals > result.awayGoals) {
                classificatedTeams.push(match.homeTeam);
                winnerTeam = match.homeTeam;
            }
            else {
                classificatedTeams.push(match.awayTeam);
                winnerTeam = match.awayTeam;
            }

            console.log(`${match.homeTeam} ${result.homeGoals} - ${result.awayGoals} ${match.awayTeam} => ${winnerTeam}`);
        }

        for (let i = 0; i < classificatedTeams.length; i++) {
            const match = {
                homeTeam: classificatedTeams[i],
                homeGoals: 0,
                awayTeam: classificatedTeams[i + 1],
                awayGoals: 0
            }

            newEliminatorySchedule.push(match);
            i++;
        }
        this.eliminatorySchedule = newEliminatorySchedule;
    }

    playThirdPlaceMatch(match) {
        let homeGoals = this.generateGoals();
        let awayGoals = this.generateGoals();
        let thirdPlaceTeam = "";

        while (homeGoals == awayGoals) {
            homeGoals = this.generateGoals();
            awayGoals = this.generateGoals();
        }
        
        if (homeGoals > awayGoals) {
            thirdPlaceTeam = match[0];
        }
        else {
            thirdPlaceTeam = match[1];
        }

        console.log(`${match[0]} ${homeGoals} - ${awayGoals} ${match[1]} => ${thirdPlaceTeam}`);
    }

    generateGoals() {
        return Math.round(Math.random() * 10)
    }

    filterTeamByGroupNameAndTeamName(groupName, teamName) {
        return this.groupStage.find(group => group.groupName == groupName).teams.find(team => team.name == teamName);
    }

    filterSummaryByGroupNameAndMatchDay(groupName, matchDay) {
        return this.summaries.find(summary => summary.groupName == groupName && summary.matchDay == matchDay);
    }

    filterClassificatedTeamByGroupAndPlace(groupNames, place) {
        const teamNames = []
        for (const groupName of groupNames) {
            if (place == "first") {
                teamNames.push(this.playOff.find(group => group.group == groupName).firstPlace);
            }
            else {
                teamNames.push(this.playOff.find(group => group.group == groupName).secondPlace);
            }
        }

        return teamNames;
    }
}