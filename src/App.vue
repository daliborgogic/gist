<template>
  <ul>
    <li>Key <span>ms</span></li>
    <li v-for="b in a" :key="b">{{ b.key }} <span>{{ b.value }}</span></li>
  </ul>
</template>

<script>
export default {
  data () {
    return {
      a: []
    }
  },
  mounted () {
    window.addEventListener('load', () => {
      const t = performance.getEntriesByType("navigation")[0]
      for (const key of [
        'redirectStart',
        'redirectEnd',
        'fetchStart',
        'domainLookupStart',
        'domainLookupEnd',
        'connectStart',
        'connectEnd',
        'secureConnectionStart',
        'requestStart',
        'responseStart',
        'responseEnd',
        'domInteractive',
        'domContentLoadedEventStart',
        'domContentLoadedEventEnd',
        'domComplete'
      ])
      this.a.push({ key, value: (t[key] - t.startTime).toFixed(2) })
    })
  }
}
</script>


