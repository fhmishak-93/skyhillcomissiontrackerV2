export function totalPts(p) {
  return p.direct + p.consult + p.followup;
}

export function poolFor(p, rates) {
  return p.direct * rates.direct + p.consult * rates.consult + p.followup * rates.followup;
}

export function calcCommissions(people, rates) {
  const totalPool    = people.reduce((s, p) => s + poolFor(p, rates), 0);
  const totalPtsAll  = people.reduce((s, p) => s + totalPts(p), 0);

  return people.map(p => {
    const pts   = totalPts(p);
    const pool  = poolFor(p, rates);
    const pct   = totalPtsAll > 0 ? (pts / totalPtsAll) * 100 : 0;
    const comm  = totalPool   > 0 ? (pct / 100) * totalPool   : 0;
    return { ...p, pts, pool, pct, comm };
  });
}

export function teamSummary(people, rates) {
  const rows       = calcCommissions(people, rates);
  const totalPool  = rows.reduce((s, r) => s + r.pool, 0);
  const totalPtsAll = rows.reduce((s, r) => s + r.pts, 0);
  const totalComm  = totalPool;
  return { rows, totalPool, totalPtsAll, totalComm };
}
