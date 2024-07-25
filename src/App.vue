<script setup lang="ts">
import { ref, shallowRef, watchEffect } from 'vue'
import { STARTS } from './jp.js'

type EmojiData = {
	id: number
	cat: string
	code: string
	rare: number[]
	read: string[]
}

const emoji = shallowRef<Map<string, EmojiData>>(new Map())
const rarity = ['', 'bg-blue-600', 'bg-blue-700', 'bg-blue-900']

const firstWord = ref('')
const emojiListTxt = ref('[]')

watchEffect(() => {
	try {
		if (!emojiListTxt.value) return
		const parsed = JSON.parse(emojiListTxt.value)
		if (!Array.isArray(parsed)) return
		const correct = parsed.flatMap((p) => {
			const z = emoji.value.get(p)
			return z ? [z] : []
		})
		console.log(correct)
	} catch (err) {
		//
	}
})

import('/data.js?url').then((r) => {
	emoji.value = new Map(r.data.map((r) => [r.code, r]))
})
</script>

<template>
	<div class="p-3">
		<div class="flex gap-2">
			<label>
				firstword
				<input v-model="firstWord" list="start-kana" class="px-2 py-1 w-15 rounded bg-gray-800" />
			</label>
			<label>
				emojiList
				<input v-model="emojiListTxt" class="px-2 py-1 rounded bg-gray-800" />
			</label>
			<datalist id="start-kana">
				<option v-for="k of STARTS" :value="k"></option>
			</datalist>
		</div>
		<details>
			<summary>table</summary>
			<table>
				<tbody>
					<tr v-for="[_, em] of emoji" :key="em.id">
						<td class="font-mono text-right">{{ em.id }}</td>
						<td class="text-lg">{{ String.fromCodePoint(parseInt(em.code, 16)) }}</td>
						<td class="flex gap-1">
							<div v-for="(rd, i) of em.read" class="px-2 py-1 rounded" :class="rarity[em.rare[i]]">
								{{ rd }}
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</details>
	</div>
</template>