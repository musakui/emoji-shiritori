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
		.filter((r) => !early || r.dst !== KANA.NN)
		.sort((a, b) => b.score - a.score)
	for (const edge of edges) {
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
	const list = new Set(avail)
	const queue = getEdges(start, list).map((i) => {
		return Object.assign([i], { score: i.score, list })
	})
	const board = []
	const pop = () => {
		let idx = 0,
			best = 0
		const short = Math.min(...queue.map((q) => q.length))
		for (const [i, q] of queue.entries()) {
			if (q.length > short || q.score <= best) continue
			best = q.score
			idx = i
		}
		return queue.splice(idx, 1)[0]
	}
	while (queue.length) {
		const path = pop()
		const plen = path.length
		if (plen > 3) {
			board.push(path)
			if (board.length > 250) break
			continue
		}
		const last = path[plen - 1]
		const word = path.score
		const list = new Set(path.list)
		list.delete(last.code)
		for (const edge of getEdges(last.dst, list)) {
			const score = word + edge.score
			queue.push(Object.assign([...path, edge], { score, list }))
		}
	}
	const iters = board.map((p) => walk(p, p.list))
	const goods = board.map(() => 0)
	while (true) {
		let some = false
		for (const [i, it] of iters.entries()) {
			const { value, done } = it.next()
			if (done) continue
			const word = value.reduce((t, r) => r.score + t, 0)
			const end = value.at(-1).dst === KANA.NN ? 10 : 0
			const all = value.length === 20 ? 20 : 0
			const score = word + end + all
			if (score < goods[i]) continue
			some = true
			if (word > goods[i]) {
				goods[i] = word
			}
			const key = value.map((p) => p.code).join('-')
			yield Object.assign(value, { score, word, end, all, key })
		}
		if (!some) break
	}
}

export const example = [
	'1f9f1',
	'1f378',
	'1f969',
	'1f3b8',
	'1f422',
	'1f50e',
	'1f40d',
	'1f416',
	'1f943',
	'1f3b0',
	'1f415',
	'1f484',
	'1f308',
	'1f37b',
	'1f408',
	'1f345',
	'1f405',
	'1f35a',
	'1f391',
	'1f992',
]
