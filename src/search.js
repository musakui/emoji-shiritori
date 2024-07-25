import * as KANA from './kana.js'
import { DAKU_MAP } from './jp.js'
import { data as emoji } from '/data.js?url'

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

export const nodes = Map.groupBy(all, ({ src }) => src)

export function* walk(path, avail) {
	const edges = nodes.get(path.at(-1).dst)?.filter((r) => avail.has(r.code))
	if (edges?.length) {
		edges.sort((a, b) => {
			return b.rare - a.rare || b.text.length - a.text.length
		})
		for (const edge of edges) {
			yield [...path, edge]
			const z = new Set(avail)
			z.delete(edge.code)
			yield * walk([...path, edge], z)
		}
	}
}