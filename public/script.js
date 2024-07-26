// prettier-ignore
const lokup = new Map([['ゃ','や'],['ゅ','ゆ'],['ょ','よ'],
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
	return ss.map((s, i) => {
		const fst = s.at(0)
		let lst = s.at(-1)
		if (lst === 'ー') {
			lst = s.at(-2)
		}
		const rare = rr[i]
		return {
			src: lokup.get(fst) ?? fst,
			dst: lokup.get(lst) ?? lst,
			emj: String.fromCodePoint(parseInt(code, 16)),
			txt: s,
			rare,
			code,
			score: [...s].length + (rare - 1) * 2,
		}
	})
}

const init = async () => {
	const resp = await fetch('/emj_get_dailychallenge.php')
	const qn = await resp.json()
	const all = []
	for (const code of qn.emojilist) {
		const p = await fetch(`/emj_get_emojimaster_id.php?ID=${code}`)
		const dt = await p.json()
		all.push(...process(code, dt.Read_Ja, dt.Rarity_Ja))
	}

	/** @type {Map<string, typeof all} */
	const nodes = Map.groupBy(all, (n) => n.src)

	return {
		start: qn.firstword,
		nodes,
	}
}
