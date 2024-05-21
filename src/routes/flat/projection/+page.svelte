<script>
    // @ts-nocheck
    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    import {reprojectImage, mask} from '$lib/reproject.js';

    let canvas;
    let outputCanvas;
    let img;
    let activeProjection = d3.geoAlbers();
    onMount(() => {
        const ctx = canvas.getContext('2d', {willReadFrequently: true});
        const outputCtx = outputCanvas.getContext('2d', {willReadFrequently: true});
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
        reprojectImage(canvas, outputCanvas, activeProjection)
    }

    const projections ={
        "Albers": d3.geoAlbers(),
        "Azimuthal Equidistant": d3.geoAzimuthalEquidistant(),
        "Conic Equal Area": d3.geoConicEqualArea(),
        "Conic Equidistant": d3.geoConicEquidistant(),
        "Equal Earth": d3.geoEqualEarth(),
        "Equirectangular": d3.geoEquirectangular(),
        "Gnomonic": d3.geoGnomonic(),
        "Mercator": d3.geoMercator(),
        "Orthographic": d3.geoOrthographic(),
        "Stereographic": d3.geoStereographic(),

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
    <canvas bind:this={outputCanvas} width="400" height="400"></canvas>

</div>
<div class="grid-container halves">
    <canvas class = "inputcanvas" bind:this={canvas} width="400" height="400"></canvas>
    <div class="controls">
        <button on:click={reproject}>Reproject</button>
        
        <select bind:value={activeProjection}>
            {#each Object.keys(projections) as proj}
            <option value={projections[proj]}>{proj}</option>
            {/each}
        </select>
    </div>
        

</div>