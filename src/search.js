import * as KANA from './kana.js'
import { DAKU_MAP } from './jp.js'
import { data } from '/data.js?url'

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
		return {
			src: DAKU_MAP.get(first) ?? first,
			dst: DAKU_MAP.get(last) ?? last,
			emj: String.fromCodePoint(parseInt(code, 16)),
			text: s,
			rare: m.rare[i],
			code,
		}
	})
})

/** @type {Map<string, typeof all} */
export const nodes = Map.groupBy(all, ({ src }) => src)

/**
 * @param {typeof all} path
 * @param {Set<string>} avail
 */
export function* walk(path, avail) {
	const early = path.length < 20
	const edges =
		nodes.get(path.at(-1).dst)?.filter((r) => {
			return avail.has(r.code) && (!early || r.dst !== KANA.NN)
		}) ?? []
	edges.sort((a, b) => {
		return b.rare - a.rare || b.text.length - a.text.length
	})
	for (const edge of edges) {
		if (!early) yield [...path, edge]
		if (avail.size === 1) continue
		const z = new Set(avail)
		z.delete(edge.code)
		yield* walk([...path, edge], z)
	}
}

/**
 * @param {string} start
 * @param {string[]} list
 */
export function* search(start, list) {
	for (const result of walk([{ dst: start }], new Set(list))) {
		const sc = result.slice(1)
		yield [sc.reduce((t, r) => r.text.length + r.rare + t, 0), ...sc]
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
