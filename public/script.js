// prettier-ignore
const knmap = new Map([['ゃ','や'],['ゅ','ゆ'],['ょ','よ'],
['ぁ','あ'],['ぃ','い'],['ぅ','う'],['ぇ','え'],['ぉ','お'],
['が','か'],['ぎ','き'],['ぐ','く'],['げ','け'],['ご','こ'],
['ざ','さ'],['じ','し'],['ず','す'],['ぜ','せ'],['ぞ','そ'],
['だ','た'],['ぢ','ち'],['づ','つ'],['で','て'],['ど','と'],
['ば','は'],['び','ひ'],['ぶ','ふ'],['べ','へ'],['ぼ','ほ'],
['ぱ','は'],['ぴ','ひ'],['ぷ','ふ'],['ぺ','へ'],['ぽ','ほ'],
])

/**
 * @param {string} code
 * @param {string[]} ss
 * @param {number[]} rr
 */
const process = (code, ss, rr) => {
	return ss.map((txt, i) => {
		const t = [...txt]
		const len = t.length
		const fst = t[0]
		const lst = t[len - (t[len - 1] === 'ー' ? 2 : 1)]
		const rare = rr[i]
		return {
			src: knmap.get(fst) ?? fst,
			dst: knmap.get(lst) ?? lst,
			emj: String.fromCodePoint(parseInt(code, 16)),
			txt,
			len,
			rare,
			code,
			score: len + (rare - 1) * 2,
		}
	})
}

export const init = async () => {
	const resp = await fetch('/emj_get_dailychallenge.php')
	/** @type {{ firstword: string, emojilist: string[] }} */
	const qn = await resp.json()
	const all = []
	for (const code of qn.emojilist) {
		const p = await fetch(`/emj_get_emojimaster_id.php?ID=${code}`)
		const d = await p.json()
		all.push(...process(code, d.Read_Ja, d.Rarity_Ja))
	}

	/** @type {Map<string, typeof all} */
	const nodes = Map.groupBy(all, (n) => n.src)

	/**
	 * @param {string} s
	 * @param {Set<string>} k
	 */
	const edges = (s, k) => nodes.get(s)?.filter((r) => k.has(r.code)) ?? []

	return {
		list: qn.emojilist,
		start: qn.firstword,
		nodes,
		edges,
	}
}
