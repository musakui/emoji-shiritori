<script setup>
import { ref, watchEffect } from 'vue'
import { STARTS } from './jp.js'
import { search, example } from './search.js'

const start = ref('す')
const emojiListTxt = ref(JSON.stringify(example))
const parsedList = ref([''])
const results = ref([])
const running = ref(false)

const startWalk = async () => {
	if (running.value) {
		running.value = false
		return
	}
	running.value = true
	results.value = []
	let i = 0
	for (const path of search(start.value, parsedList.value)) {
		if (++i > 500 || !running.value) break
		results.value.push(path)
		await new Promise((r) => setTimeout(r, 12))
	}
	results.value.sort((a, b) => b[0] - a[0])
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
	<div class='p-3'>
		<div class='flex gap-2'>
			<label>
				start
				<input v-model='start' list='start-kana' class='px-2 py-1 w-15 rounded bg-gray-800' />
			</label>
			<label>
				list
				<input v-model='emojiListTxt' class='px-2 py-1 rounded bg-gray-800' />
			</label>
			<datalist id='start-kana'>
				<option v-for='k of STARTS' :value='k'></option>
			</datalist>
			<button class='px-2 py-1 rounded bg-gray-700' @click='startWalk'>walk</button>
		</div>
		<div class='p-2 flex flex-col'>
			<details v-for='[sc, ...items] of results' class='py-1'>
				<summary>
					<span v-for='itm of items'>{{ itm.emj }}</span>
					({{ sc }})
				</summary>
				<span v-for='itm of items'>{{ itm.emj }} {{ itm.text }}&nbsp;</span>
			</details>
		</div>
	</div>
</template>