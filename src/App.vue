<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { STARTS } from './jp.js'
import { data as emoji } from '/data.js?url'
import { walk } from './search.js'

const rarity = ['', 'bg-blue-600', 'bg-blue-700', 'bg-blue-900']
const firstWord = ref('す')
const emojiListTxt = ref('[]')
const parsedList = ref([])
const running = ref(false)

const startWalk = () => {
	if (running.value) {
		running.value = false
		return
	}
	running.value = true
	const st = [{ dst: firstWord.value }]
	let i = 0
	const full = []
	for (const result of walk(st, new Set(parsedList.value))) {
		if (result.length < 21) continue
		const sc = result.slice(1)
		full.push([sc.reduce((t, r) => r.rare + t, 0), ...sc])
		++i
		if (i > 200 || !running.value) break
	}
	full.sort((a, b) => b[0] - a[0])
	console.log(full)
	running.value = false
}

watchEffect(() => {
	try {
		if (!emojiListTxt.value) return
		const parsed = JSON.parse(emojiListTxt.value)
		if (!Array.isArray(parsed)) return
		parsedList.value = parsed
	} catch (err) {
		//
	}
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
			<button class="px-2 py-1 rounded bg-gray-700" @click="startWalk">walk</button>
		</div>
		<details>
			<summary>table</summary>
			<table>
				<tbody>
					<tr v-for="em of emoji" :key="em.id">
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