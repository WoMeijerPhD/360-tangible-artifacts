<script>
    import { marked } from 'marked';

	export let data;

    let html = marked(data.content || '#something has gone wrong...');
</script>

<svelte:head>
	<title>Tangible 360° Artifact Toolkit</title>
</svelte:head>

<div class="container">
    {@html html}
</div>
