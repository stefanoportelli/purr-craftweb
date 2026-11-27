#!/usr/bin/env python3
"""
Purr-craft — Simulatore Monte Carlo Standalone (Livello 1)
Esegue N partite headless su mappe procedurali variabili testando 4 archetipi giocatore.
Uso:
  python3 montecarlo_sim.py
  python3 montecarlo_sim.py --runs 500 --start-dna 120 --amal-hp 3200
"""
import argparse, json, math, random, time

DEFAULTS = {
    "startDna": 100, "dnaPerSec": 2.0, "baseHp": 100, "sellRefund": 0.50,
    "waveClearBonus": 0, "waveHpMul": 1.00,
    "cost0": 50, "cost1": 30, "cost2": 50, "cost3": 80, "cost4": 120,
    "baseDmg": 10, "baseRate": 0.67, "baseRange": 4.4,
    "fireDmg": [0, 30, 65, 120, 220], "fireRate": [0, 0.67, 0.50, 0.40, 0.286],
    "fireRange": [0, 5.2, 5.8, 6.4, 7.2], "fireSplash": [0, 1.0, 1.2, 1.5, 2.0],
    "elecDmg": [0, 35, 80, 150, 260], "elecRate": [0, 0.67, 0.50, 0.40, 0.286],
    "elecRange": [0, 5.8, 6.5, 7.3, 8.5],
    "plasmaDmg": 480, "plasmaRate": 2.0, "plasmaRange": 8.5,
    "magmaDmg": 135, "magmaRate": 0.40, "magmaRange": 6.6, "magmaSplash": 1.55,
    "pyroDmg": 175, "pyroRate": 0.38, "pyroRange": 7.5,
    "poliHp": 50, "poliSpd": 1.90, "poliBounty": 4, "poliLeak": 5,
    "abomHp": 350, "abomSpd": 0.85, "abomBounty": 20, "abomLeak": 15, "abomArmor": 0.60,
    "tentHp": 120, "tentSpd": 1.65, "tentBounty": 10, "tentLeak": 10,
    "amalHp": 3000, "amalSpd": 0.62, "amalBounty": 150, "amalLeak": 100,
    "w1Poli": 20, "w2Poli": 22, "w2Abom": 3, "w3Poli": 18, "w3Tent": 14,
    "w4Poli": 28, "w4Abom": 4, "w4Tent": 12, "w5Poli": 16, "w5Tent": 10,
}

def make_board(seed):
    rng = random.Random(seed)
    n_pts = rng.randint(112, 138)
    step = 0.25
    L = (n_pts - 1) * step
    px, pz = [], []
    x, z, ang = -12.0, -10.0, 0.72
    for i in range(n_pts):
        s = i * step
        px.append(x); pz.append(z)
        ang += math.sin(s * 0.24 + rng.uniform(-0.08, 0.08)) * 0.14
        x += math.cos(ang) * step; z += math.sin(ang) * step
    n_pads = rng.randint(6, 8)
    pads = []
    for k in range(n_pads):
        s_pad = L * (0.17 + (0.68 / max(1, n_pads - 1)) * k)
        idx = min(n_pts - 2, int(s_pad / step))
        dx = px[idx+1] - px[idx]; dz = pz[idx+1] - pz[idx]; dl = math.hypot(dx, dz) or 1.0
        side = 1 if k % 2 == 0 else -1
        off = rng.uniform(2.05, 2.55)
        pads.append({"x": px[idx] - dz/dl * side * off, "z": pz[idx] + dx/dl * side * off, "s": s_pad, "cov": 0.0})
    for p in pads:
        p["cov"] = sum(step * 2 for i in range(0, n_pts, 2) if (p["x"] - px[i])**2 + (p["z"] - pz[i])**2 < 5.2**2)
    return {"px": px, "pz": pz, "n": n_pts, "L": L, "step": step, "pads": pads}

def path_at(B, s):
    f = max(0.0, min(B["n"] - 1.001, s / B["step"]))
    i = int(f); u = f - i
    return B["px"][i] * (1 - u) + B["px"][i+1] * u, B["pz"][i] * (1 - u) + B["pz"][i+1] * u

def cat_prof(dna, C):
    n = len(dna); f = dna.count("fire"); e = dna.count("elec")
    if n == 0: return {"model": "base", "air": False, "ground": True, "dmg": C["baseDmg"], "rate": C["baseRate"], "range": C["baseRange"], "splash": 0.0}
    if f == 2 and e == 2: return {"model": "elec", "air": True, "ground": False, "dmg": C["plasmaDmg"], "rate": C["plasmaRate"], "range": C["plasmaRange"], "splash": 0.0}
    if f == 3 and e == 1: return {"model": "fire", "miniStun": True, "air": False, "ground": True, "dmg": C["magmaDmg"], "rate": C["magmaRate"], "range": C["magmaRange"], "splash": C["magmaSplash"]}
    if e == 3 and f == 1: return {"model": "elec", "air": True, "ground": False, "dmg": C["pyroDmg"], "rate": C["pyroRate"], "range": C["pyroRange"], "splash": 0.0}
    if f > e: return {"model": "fire", "air": False, "ground": True, "dmg": C["fireDmg"][n], "rate": C["fireRate"][n], "range": C["fireRange"][n], "splash": C["fireSplash"][n]}
    return {"model": "elec", "air": True, "ground": False, "dmg": C["elecDmg"][n], "rate": C["elecRate"][n], "range": C["elecRange"][n], "splash": 0.0}

def sim_one(B, C, policy, seed):
    rng = random.Random(seed)
    gold = float(C["startDna"])
    lives = max_lives = int(C["baseHp"])
    costs = [C["cost0"], C["cost1"], C["cost2"], C["cost3"], C["cost4"]]
    pads_order = list(range(len(B["pads"])))
    if policy == "casual":
        pads_order.sort(key=lambda i: -B["pads"][i]["cov"] + rng.uniform(-3.0, 3.0))
    else:
        pads_order.sort(key=lambda i: (-B["pads"][i]["cov"], abs(B["pads"][i]["s"]/B["L"] - 0.45)))

    towers, used_pads, mons, shells = [], set(), [], []
    dt, wave, spawning, next_in, wave_t, queue, boss_wave = 0.12, 0, False, 0.9, 0.0, [], False
    trickle, trickle_n, ai_cd = 6.0, 0, 0.0

    mdefs = {
        "polipetto": (C["poliHp"], C["poliSpd"], C["poliBounty"], C["poliLeak"], False, 0.24, 1.0, False),
        "abominio":  (C["abomHp"], C["abomSpd"], C["abomBounty"], C["abomLeak"], False, 0.48, C["abomArmor"], False),
        "tentacolo": (C["tentHp"], C["tentSpd"], C["tentBounty"], C["tentLeak"], True,  0.26, 1.0, False),
        "amalgama":  (C["amalHp"], C["amalSpd"], C["amalBounty"], C["amalLeak"], False, 0.98, 1.0, True),
    }

    def make_q(k):
        q, t, hm = [], 0.6, C["waveHpMul"]
        def grp(ty, cnt, gap):
            nonlocal t
            for _ in range(int(cnt)):
                q.append([t, ty, hm]); t += gap * rng.uniform(0.85, 1.15)
            t += rng.uniform(1.0, 1.8)
        if k == 1:
            n1 = C["w1Poli"] // 2; grp("polipetto", n1, 0.32); grp("polipetto", C["w1Poli"] - n1, 0.26)
        elif k == 2:
            n1 = C["w2Poli"] // 2; grp("polipetto", n1, 0.28); grp("abominio", C["w2Abom"], 1.6); grp("polipetto", C["w2Poli"] - n1, 0.24)
        elif k == 3:
            n1 = C["w3Poli"] // 2; a1 = C["w3Tent"] // 2
            grp("polipetto", n1, 0.28); grp("tentacolo", a1, 0.42); grp("polipetto", C["w3Poli"] - n1, 0.26); grp("tentacolo", C["w3Tent"] - a1, 0.38)
        elif k == 4:
            n1 = int(C["w4Poli"] * 0.43); ab1 = C["w4Abom"] // 2
            grp("polipetto", n1, 0.25); grp("abominio", ab1, 1.4); grp("tentacolo", C["w4Tent"], 0.38); grp("polipetto", C["w4Poli"] - n1, 0.22); grp("abominio", C["w4Abom"] - ab1, 1.3)
        else:
            q.append([2.0, "amalgama", hm]); t = 4.5
            grp("polipetto", C["w5Poli"], 0.26); grp("tentacolo", C["w5Tent"], 0.40)
        q.sort(key=lambda x: x[0]); return q

    def spawn(ty, hm=1.0, s_init=None):
        hp, spd, bty, lk, fly, rad, arm, boss = mdefs[ty]
        s0 = (0.9 + rng.random() * 0.5) if s_init is None else s_init
        x, z = path_at(B, s0)
        mons.append({"hp": hp * hm, "spd": spd * rng.uniform(0.93, 1.07), "bty": bty, "lk": lk, "fly": fly, "rad": rad, "arm": arm, "boss": boss, "s": s0, "x": x, "z": z, "slowT": 0.0, "slowF": 0.0})

    def build_pad():
        nonlocal gold
        for pi in pads_order:
            if pi not in used_pads:
                used_pads.add(pi); gold -= costs[0]; p = B["pads"][pi]
                towers.append({"x": p["x"], "z": p["z"], "dna": [], "prof": cat_prof([], C), "cool": 0.75, "stun": 0.0})
                return

    def mut_tw(tw, elem):
        nonlocal gold
        gold -= costs[len(tw["dna"]) + 1]; tw["dna"].append(elem); tw["prof"] = cat_prof(tw["dna"], C)

    def decide():
        n_tw = len(towers)
        n_elec = sum(1 for tw in towers if tw["prof"]["model"] == "elec")
        flyers_now = any(m["fly"] for m in mons)
        air_soon = (wave >= 2 and not spawning and next_in < 3.5) or wave >= 3 or flyers_now
        unmut = next((tw for tw in towers if len(tw["dna"]) == 0), None)

        if policy == "base_only":
            if gold >= costs[0] and len(used_pads) < len(B["pads"]): build_pad()
        elif policy == "fire_only":
            if unmut and gold >= costs[1]: mut_tw(unmut, "fire"); return
            if n_tw < 3 and gold >= costs[0] and len(used_pads) < len(B["pads"]): build_pad(); return
            upg = sorted([tw for tw in towers if len(tw["dna"]) < 4], key=lambda t: len(t["dna"]))
            if upg and gold >= costs[len(upg[0]["dna"]) + 1]: mut_tw(upg[0], "fire")
        elif policy == "casual":
            if unmut and gold >= costs[1]:
                elem = "elec" if (flyers_now and n_elec < 2) else ("elec" if (wave >= 3 and n_elec == 0 and rng.random() < 0.7) else "fire")
                mut_tw(unmut, elem); return
            if flyers_now and n_elec == 0 and gold >= costs[0] + costs[1] and len(used_pads) < len(B["pads"]): build_pad(); return
            if n_tw < min(5, wave + 1) and gold >= costs[0] and len(used_pads) < len(B["pads"]) and rng.random() < 0.55: build_pad(); return
            cands = [tw for tw in towers if len(tw["dna"]) < 4 and gold >= costs[len(tw["dna"]) + 1]]
            if cands:
                tw = rng.choice(cands)
                mut_tw(tw, "elec" if tw["prof"]["model"] == "elec" else ("elec" if (flyers_now and rng.random() < 0.25) else "fire"))
        else:
            if unmut and gold >= costs[1]:
                mut_tw(unmut, "elec" if (air_soon and n_elec < (2 if wave >= 4 else 1)) else "fire"); return
            if air_soon and n_elec < (2 if wave >= 4 else 1):
                if gold >= costs[0] + costs[1] and len(used_pads) < len(B["pads"]): build_pad(); return
                el_u = sorted([tw for tw in towers if tw["prof"]["model"] == "elec" and len(tw["dna"]) < 4], key=lambda t: len(t["dna"]))
                if el_u and gold >= costs[len(el_u[0]["dna"]) + 1]: mut_tw(el_u[0], "elec"); return
            if n_tw < (2 if wave <= 1 else (3 if wave == 2 else 4)) and len(used_pads) < len(B["pads"]) and gold >= costs[0] + costs[1]:
                build_pad(); return
            cands = sorted([tw for tw in towers if 0 < len(tw["dna"]) < 4], key=lambda t: (0 if (air_soon and t["prof"]["model"]=="elec" and len(t["dna"])<2) else 1, len(t["dna"])))
            if cands and gold >= costs[len(cands[0]["dna"]) + 1]:
                mut_tw(cands[0], "elec" if cands[0]["prof"]["model"] == "elec" else "fire")

    t_tot = 0.0
    while t_tot < 420.0:
        t_tot += dt; gold += dt * C["dnaPerSec"]; ai_cd -= dt
        if ai_cd <= 0: ai_cd = 1.6 if policy == "casual" else 0.45; decide()
        if spawning:
            wave_t += dt
            while queue and queue[0][0] <= wave_t:
                _, ty, hm = queue.pop(0); spawn(ty, hm)
            if not queue:
                if boss_wave and any(m["boss"] for m in mons):
                    trickle -= dt
                    if trickle <= 0 and trickle_n < 9:
                        trickle_n += 1; trickle = rng.uniform(3.2, 4.6)
                        ty = "polipetto" if rng.random() < 0.67 else "tentacolo"
                        for j in range(3 if ty == "polipetto" else 1): queue.append([wave_t + j * 0.4, ty, C["waveHpMul"]])
                else:
                    spawning = False; gold += C["waveClearBonus"]; next_in = -1 if boss_wave else 6.5
        elif boss_wave:
            if not mons: return {"win": True, "lives": lives, "maxLives": max_lives, "wave": 5}
        else:
            next_in -= dt
            if next_in <= 0:
                wave += 1; boss_wave = (wave == 5); trickle = 6.0; trickle_n = 0; queue = make_q(wave); wave_t = 0.0; spawning = True

        for i in range(len(mons) - 1, -1, -1):
            m = mons[i]
            if m["slowT"] > 0:
                m["slowT"] -= dt
                if m["slowT"] <= 0: m["slowF"] = 0.0
            m["s"] += m["spd"] * (1.0 - m["slowF"]) * dt
            if m["s"] >= B["L"] - 0.35:
                lives -= m["lk"]; mons.pop(i)
                if lives <= 0: return {"win": False, "lives": 0, "maxLives": max_lives, "wave": max(1, wave)}
                continue
            m["x"], m["z"] = path_at(B, m["s"])

        for tw in towers:
            if tw["stun"] > 0: tw["stun"] -= dt; continue
            tw["cool"] -= dt
            if tw["cool"] > 0: continue
            pr = tw["prof"]; r2 = pr["range"] ** 2
            best, bp = None, -1.0
            for m in mons:
                if m["s"] < 2.2 or (m["fly"] and not pr["air"]) or (not m["fly"] and not pr["ground"]): continue
                if (tw["x"] - m["x"])**2 + (tw["z"] - m["z"])**2 <= r2:
                    sc = m["s"] / B["L"] + (2.0 if m["fly"] else 0.0)
                    if sc > bp: bp = sc; best = m
            if not best: tw["cool"] = 0.1; continue
            tw["cool"] = pr["rate"] * rng.uniform(0.94, 1.06)
            if pr["model"] == "base": best["hp"] -= pr["dmg"] * (best["arm"] if best["arm"] < 1 else 1.0)
            elif pr["model"] == "elec": best["hp"] -= pr["dmg"]
            else:
                T = max(0.14, min(0.65, math.hypot(best["x"] - tw["x"], best["z"] - tw["z"]) / 10.0))
                tx, tz = path_at(B, min(B["L"] - 0.1, best["s"] + best["spd"] * (1.0 - best["slowF"]) * T))
                shells.append({"t": T, "tx": tx, "tz": tz, "dmg": pr["dmg"], "splash": pr["splash"], "stun": pr.get("miniStun", False)})

        for i in range(len(shells) - 1, -1, -1):
            sh = shells[i]; sh["t"] -= dt
            if sh["t"] <= 0:
                shells.pop(i)
                for m in mons:
                    if not m["fly"] and m["hp"] > 0 and math.hypot(m["x"] - sh["tx"], m["z"] - sh["tz"]) <= sh["splash"] + m["rad"]:
                        m["hp"] -= sh["dmg"]
                        if sh["stun"] and not m["boss"] and rng.random() < 0.15:
                            m["slowF"] = max(m["slowF"], 0.95); m["slowT"] = max(m["slowT"], 1.2)

        children = []
        for i in range(len(mons) - 1, -1, -1):
            m = mons[i]
            if m["hp"] <= 0:
                gold += m["bty"]
                if m["boss"]:
                    sb = max(0.5, m["s"] - 2.0)
                    children.extend([sb] * 4)
                    tw_hit = min(towers, key=lambda t: (t["x"]-m["x"])**2+(t["z"]-m["z"])**2, default=None)
                    if tw_hit and (tw_hit["x"]-m["x"])**2+(tw_hit["z"]-m["z"])**2 < 27.04: tw_hit["stun"] = 3.0
                mons.pop(i)
        for sb in children:
            spawn("polipetto", 1.0, sb); mons[-1]["slowF"] = 0.98; mons[-1]["slowT"] = 1.0
    return {"win": False, "lives": lives, "maxLives": max_lives, "wave": wave}

def main():
    ap = argparse.ArgumentParser(description="Purr-craft Monte Carlo Level 1 Simulator")
    ap.add_argument("--runs", type=int, default=250, help="Run per ciascun profilo giocatore")
    ap.add_argument("--start-dna", type=float, default=None)
    ap.add_argument("--dna-sec", type=float, default=None)
    ap.add_argument("--amal-hp", type=float, default=None)
    ap.add_argument("--config", type=str, default=None, help="File JSON esportato dal pannello F8")
    args = ap.parse_args()

    C = dict(DEFAULTS)
    if args.config:
        with open(args.config, "r", encoding="utf-8") as f:
            raw = json.load(f)
        for k, v in raw.items():
            if k in C: C[k] = v
    if args.start_dna is not None: C["startDna"] = args.start_dna
    if args.dna_sec is not None: C["dnaPerSec"] = args.dna_sec
    if args.amal_hp is not None: C["amalHp"] = args.amal_hp

    boards = [make_board(700 + i) for i in range(25)]
    t0 = time.time()
    print(f"Purr-craft Monte Carlo — {args.runs} run x 4 profili su 25 mappe procedurali")
    print("-" * 78)
    print(f"{'Profilo':<22} | {'Win %':>6} | {'3 Stelle':>8} | {'2+ Stelle':>9} | {'HP Medi':>7} | {'KO Wave'}")
    print("-" * 78)
    for pol, name in [("base_only", "Solo Base (0 DNA)"), ("fire_only", "Solo Fuoco (No AA)"), ("casual", "Giocatore Casual"), ("optimal", "Strategia Ottimale")]:
        res = [sim_one(boards[i % len(boards)], C, pol, 9000 + i) for i in range(args.runs)]
        wins = sum(1 for r in res if r["win"])
        s3 = sum(1 for r in res if r["win"] and r["lives"] >= r["maxLives"])
        s2 = sum(1 for r in res if r["win"] and r["lives"] >= 0.8 * r["maxLives"])
        avg_hp = sum(r["lives"] for r in res) / len(res)
        fails = {}
        for r in res:
            if not r["win"]: fails[r["wave"]] = fails.get(r["wave"], 0) + 1
        print(f"{name:<22} | {wins*100/args.runs:5.1f}% | {s3*100/args.runs:7.1f}% | {s2*100/args.runs:8.1f}% | {avg_hp:7.1f} | {fails or '-'}")
    print("-" * 78)
    print(f"Completato in {time.time() - t0:.2f}s")

if __name__ == "__main__":
    main()
