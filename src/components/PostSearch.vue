<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import MiniSearch from 'minisearch'

const miniSearch = new MiniSearch({
  fields: ['title', 'content'], // fields to index for full-text search
  storeFields: ['date', 'tags', 'title', 'url'], // fields to return with search results
})

await fetch('/data/posts.json')
  .then(async (res) => {
    const posts = (await res.json()) as any[]
    posts.forEach((post, i) => {
      post.id = i
    })
    miniSearch.addAll(posts)
  })
  .catch((err) => {
    console.log(err)
  })

const keyword = ref('')
const results = computed(() => miniSearch.search(keyword.value))

onMounted(() => {
  console.log(window.location.href)
})
</script>

<template>
  <div>
    <input
      v-model="keyword"
      class="text-black w-64 px-3 py-2 rounded-xl border-2 border-blue-400 focus:outline-none"
      placeholder="在此输入搜索关键词..."
    />

    <div v-for="i of results" class="my-4">
      <a :href="i.url">{{ i.title }}</a>
    </div>
  </div>
</template>

<style scoped></style>
