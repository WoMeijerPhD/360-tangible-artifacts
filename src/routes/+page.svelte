<script>
    import { marked } from 'marked';


	export let data;

    let html = marked(data.content || '#something has gone wrong...');


</script>

<div class="container">
    {@html html}
</div>
