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
	return m.read.map((s, i) => {
		const first = s.at(0)
		let last = s.at(-1)
		if (last === KANA.CHO) {
			last = s.at(-2)
		}
		const rare = m.rare[i]
		return {
			src: lookup.get(first) ?? first,
			dst: lookup.get(last) ?? last,
			emj: String.fromCodePoint(parseInt(code, 16)),
			text: s,
			rare,
			code,
			score: [...s].length + (rare - 1) * 2,
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
	const early = path.length < 19
	const edges = getEdges(path.at(-1).dst, avail)
		.filter((r) => !early || r.dst !== KANA.NN)
		.sort((a, b) => b.score - a.score)
	for (const edge of edges) {
		if (!early) yield [...path, edge]
		if (avail.size === 1) continue
		const z = new Set(avail)
		z.delete(edge.code)
		yield* walk([...path, edge], z)
	}
}

/**
 * @param {typeof all} init
 * @param {string[]} list
 */
export function* search(init, list) {
	let good = 0
	for (const ans of walk(init, new Set(list))) {
		const word = ans.reduce((t, r) => r.score + t, 0)
		const end = ans.at(-1).dst === KANA.NN ? 10 : 0
		const all = ans.length === 20 ? 20 : 0
		const score = word + end + all
		if (score < good) continue
		if (word > good) {
			good = word
		}
		yield Object.assign(ans, { word, end, all, score })
	}
}

/**
 * @param {string} start
 * @param {string[]} list
 */
export function* solve(start, list) {
	const iters = getEdges(start, new Set(list)).map((i) => {
		const la = new Set(list)
		la.delete(i.code)
		return search([i], la)
	})
	while (true) {
		let some = false
		for (const it of iters) {
			const { value, done } = it.next()
			if (done) continue
			some = true
			if (value) yield value
		}
		if (!some) break
	}
}

export const example = [
	'1f6f5',
	'1f93f',
	'1f97f',
	'1f384',
	'1f34e',
	'1f997',
	'1f42b',
	'1f50e',
	'1f43b',
	'1f476',
	'1f422',
	'1f4dd',
	'1f412',
	'1f408',
	'23f0',
	'1f429',
	'1f9f8',
	'1f459',
	'1f95f',
	'1f335',
]
