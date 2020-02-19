<script lang="typescript">
import Viewer from './viewer.svelte'
</script>

<template lang="pug">
.flex.flex-row
  Viewer(S!="{9}" T!="{9}" H!="{512}" W!="{512}" src="/data/chess/combined.png")
  Viewer(S!="{9}" T!="{9}" H!="{512}" W!="{512}" src="/data/chess-mpi/combined.png")
</template>
