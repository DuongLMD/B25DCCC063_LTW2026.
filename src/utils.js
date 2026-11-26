import { MAX_GOALS, POINTS, RESULT_LABELS, TEAMS, formatDiff } from "./data";

export function getTeamName(id) {
  const team = TEAMS.find((t) => t.id === id);
  return team ? team.name : "";
}

export function getResult(match) {
  if (match.homeGoals > match.awayGoals) {
    return RESULT_LABELS.home;
  }
  if (match.awayGoals > match.homeGoals) {
    return RESULT_LABELS.away;
  }
  return RESULT_LABELS.draw;
}

export function isValidGoals(n) {
  return (
    typeof n === "number" &&
    Number.isInteger(n) &&
    n >= 0 &&
    n <= MAX_GOALS
  );
}

export function calcStandings(matches) {
  const tableMap = new Map();

  for (const team of TEAMS) {
    tableMap.set(team.id, {
      id: team.id,
      name: team.name,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
      diff: 0,
      points: 0,
    });
  }

  for (const m of matches) {
    const home = tableMap.get(m.home);
    const away = tableMap.get(m.away);
    if (!home || !away) continue;

    home.played += 1;
    away.played += 1;

    home.gf += m.homeGoals;
    home.ga += m.awayGoals;
    away.gf += m.awayGoals;
    away.ga += m.homeGoals;

    if (m.homeGoals > m.awayGoals) {
      home.won += 1;
      away.lost += 1;
      home.points += POINTS.win;
      away.points += POINTS.loss;
    } else if (m.awayGoals > m.homeGoals) {
      away.won += 1;
      home.lost += 1;
      away.points += POINTS.win;
      home.points += POINTS.loss;
    } else {
      home.drawn += 1;
      away.drawn += 1;
      home.points += POINTS.draw;
      away.points += POINTS.draw;
    }
  }

  const rows = [...tableMap.values()].map((row) => ({
    ...row,
    diff: row.gf - row.ga,
  }));

  rows.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.diff !== a.diff) return b.diff - a.diff;
    if (b.gf !== a.gf) return b.gf - a.gf;
    return a.name.localeCompare(b.name, "vi");
  });

  return rows.map((row, idx) => ({
    ...row,
    rank: idx + 1,
    diffLabel: formatDiff(row.diff),
  }));
}

export function calcMatchStats(matches) {
  const count = matches.length;
  let goals = 0;
  const counts = {
    home: 0,
    draw: 0,
    away: 0,
  };

  for (const m of matches) {
    goals += m.homeGoals + m.awayGoals;
    if (m.homeGoals > m.awayGoals) {
      counts.home += 1;
    } else if (m.awayGoals > m.homeGoals) {
      counts.away += 1;
    } else {
      counts.draw += 1;
    }
  }

  const rawAvg = count > 0 ? Math.round((goals / count) * 100) / 100 : 0;
  const average = rawAvg.toFixed(2);

  return {
    count,
    goals,
    average,
    counts,
  };
}
