import * as KANA from './kana.js'
import { data } from '/data.js?url'

const lookup = new Map([
	[KANA.XA, KANA.A],
	[KANA.XI, KANA.I],
	[KANA.XU, KANA.U],
	[KANA.XE, KANA.E],
	[KANA.XO, KANA.O],
	[KANA.GA, KANA.KA],
	[KANA.GI, KANA.KI],
	[KANA.GU, KANA.KU],
	[KANA.GE, KANA.KE],
	[KANA.GO, KANA.KO],
	[KANA.ZA, KANA.SA],
	[KANA.ZI, KANA.SI],
	[KANA.ZU, KANA.SU],
	[KANA.ZE, KANA.SE],
	[KANA.ZO, KANA.SO],
	[KANA.DA, KANA.TA],
	[KANA.DI, KANA.TI],
	[KANA.DU, KANA.TU],
	[KANA.DE, KANA.TE],
	[KANA.DO, KANA.TO],
	[KANA.BA, KANA.HA],
	[KANA.BI, KANA.HI],
	[KANA.BU, KANA.HU],
	[KANA.BE, KANA.HE],
	[KANA.BO, KANA.HO],
	[KANA.PA, KANA.HA],
	[KANA.PI, KANA.HI],
	[KANA.PU, KANA.HU],
	[KANA.PE, KANA.HE],
	[KANA.PO, KANA.HO],
	[KANA.XYA, KANA.YA],
	[KANA.XYU, KANA.YU],
	[KANA.XYO, KANA.YO],
])

const emoji =
	/** @type {{ code: string, read: string[], rare: number[] }[]} */ (data)

export const all = emoji.flatMap((m) => {
	const code = m.code
	return m.read.map((txt, i) => {
		const t = [...txt]
		const len = t.length
		const fst = t[0]
		const lst = t[len - (t[len - 1] === KANA.CHO ? 2 : 1)]
		const rare = m.rare[i]
		return {
			src: lookup.get(fst) ?? fst,
			dst: lookup.get(lst) ?? lst,
			emj: String.fromCodePoint(parseInt(code, 16)),
			txt,
			nnn: lst === KANA.NN ? 10 : 0,
			len,
			rare,
			code,
			score: len + (rare - 1) * 2,
		}
	})
})

/** @type {Map<string, typeof all} */
export const nodes = Map.groupBy(all, ({ src }) => src)

/**
 * @param {string} src
 * @param {Set<string>} avail
 */
const getEdges = (src, avail) => {
	return nodes.get(src)?.filter((r) => avail.has(r.code)) ?? []
}

/**
 * @param {typeof all} path
 * @param {Set<string>} avail
 * @return {Generator<typeof all, void, unknown>}
 */
export function* walk(path, avail) {
	const last = path.at(-1)
	const early = path.length < 19
	avail.delete(last.code)
	const edges = getEdges(path.at(-1).dst, avail)
		.sort((a, b) => b.score - a.score)
	for (const edge of edges) {
		if (early && edge.nnn) continue
		const np = [...path, edge]
		if (!early) yield np
		if (avail.size === 1) continue
		yield* walk(np, new Set(avail))
	}
}

/**
 * @param {string} start
 * @param {string[]} avail
 */
export function* solve(start, avail) {
	const board = getEdges(start, new Set(avail)).map((i) => {
		const list = new Set(avail)
		return Object.assign([i], { list })
	})
	const iters = board.map((p) => walk(p, p.list))
	const goods = board.map(() => 0)
	const uniqs = board.map(() => new Set([0]))
	while (true) {
		const results = iters.map((it) => it.next())
		if (results.every((r) => r.done)) break
		for (const [i, { value, done }] of results.entries()) {
			if (done) continue
			const word = value.reduce((t, r) => r.score + t, 0)
			const all = value.length === 20 ? 20 : 0
			const end = value.at(-1).nnn
			const score = word + end + all
			if (word <= goods[i] && uniqs[i].has(score)) continue
			if (word > goods[i]) {
				goods[i] = word
			}
			if (!uniqs[i].has(score)) uniqs[i].add(score)
			const key = value.map((p) => p.code).join('-')
			yield Object.assign(value, { score, word, end, all, key })
		}
	}
}

export const example = [
	'1f997',
	'1f996',
	'1f943',
	'1f952',
	'1f34e',
	'1f965',
	'1f3a3',
	'1f34a',
	'1f370',
	'1f344',
	'1f47b',
	'1f405',
	'1f3d3',
	'1f98e',
	'1f382',
	'1f408',
	'1f345',
	'1f69a',
	'1f484',
	'1f955',
]
