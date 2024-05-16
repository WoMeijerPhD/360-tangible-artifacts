<script>
    // @ts-nocheck
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import {geoAitoff} from 'd3-geo-projection';

    import {reprojectImage} from '$lib/reproject.js';

    let canvas;
    let outputCanvas;
    let img;
    onMount(() => {
        const ctx = canvas.getContext('2d');
        const outputCtx = outputCanvas.getContext('2d');
        const imagetag = document.querySelector('img');

        // set the canvas to the same size as the image


        // Draw on the canvas
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Copy the canvas to the output canvas
        outputCtx.drawImage(canvas, 0, 0);

        // copy the image to the canvas
        img = new Image();
        img.src = imagetag.src;
        img.onload = function () {
            canvas.width = imagetag.width;
            canvas.height = imagetag.height;
            outputCanvas.width = imagetag.width;
            outputCanvas.height = imagetag.height;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
    });

    function reproject(){
        reprojectImage(canvas, outputCanvas, geoAitoff())
    }
</script>

<style>
    .grid-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 10px;
    }

    .halves {
        grid-template-columns: repeat(2, 1fr);
    }

    img {
        width: 100%;
        height: auto;
    }

    .inputcanvas {
        /* display: none; */
    }
</style>


<div class="grid-container halves">
    <img src="/test.jpeg" alt="Kitten" />
    <canvas bind:this={outputCanvas} width="350" height="350"></canvas>

</div>
<div class="grid-container halves">
    <canvas class = "inputcanvas" bind:this={canvas} width="400" height="400"></canvas>
    <button on:click={reproject}>Reproject</button>
</div>