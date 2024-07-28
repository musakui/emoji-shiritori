<script setup>
import { ref, watchEffect } from 'vue'
import { STARTS, KANA } from './jp.js'
import { solve, example } from './search.js'

const start = ref(KANA.KO)
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
	for (const path of solve(start.value, parsedList.value)) {
		if (++i > 200 || !running.value) break
		results.value.push(path)
		await new Promise((r) => setTimeout(r, 12))
	}
	results.value.sort((a, b) => b.score - a.score)
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
			<button class='px-2 py-1 rounded bg-gray-700' @click='startWalk'>
				{{ running ? 'stop' : 'solve' }}
			</button>
		</div>
		<div class='p-2 flex flex-col'>
			<TransitionGroup enter-active-class="duration-100 ease-out" enter-from-class="transform opacity-0"
				enter-to-class="opacity-100">
				<details v-for='chain of results' :key="chain.key" class='py-1'>
					<summary>
						<span v-for='itm of chain' :title="itm.score">{{ itm.emj }}</span>
						({{ chain.score }})
					</summary>
					<div class="flex flex-wrap gap-1 p-1">
						<div class="px-2 rounded rounded-lg bg-gray-700">{{ chain.word }}</div>
						<div v-if="chain.end" class="px-2 rounded rounded-lg bg-gray-700">{{ KANA.NN }}</div>
						<div v-if="chain.all" class="px-2 rounded rounded-lg bg-gray-700">all</div>
					</div>
					<div class="flex flex-wrap">
						<div v-for='itm of chain'>
							{{ itm.emj }} {{ itm.txt }} －
						</div>
					</div>
				</details>
			</TransitionGroup>
		</div>
	</div>
</template>