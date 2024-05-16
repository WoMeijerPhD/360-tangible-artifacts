<script>
	// @ts-nocheck

	import { onMount } from 'svelte';

	let canvas;
	let backupcanvas;
    let overlay;
	let rect;
	let outputCanvas;

	onMount(() => {
		const imageContainer = document.getElementById('image-container');
		const slider = document.getElementById('slider');
        const vslider = document.getElementById('v-slider');
		rect = overlay.getBoundingClientRect();
		resizeCanvas();
		const image = new Image();

		function allowDrop(event) {
			event.preventDefault();
		}

		function drop(event) {
			event.preventDefault();
			const imageFile = event.dataTransfer.files[0];
			const reader = new FileReader();
			reader.onload = function (e) {
				const img = new Image();
				img.src = e.target.result;
				img.onload = function () {
					const ctx = canvas.getContext('2d');
					ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
					const ctx2 = backupcanvas.getContext('2d');
					ctx2.drawImage(img, 0, 0, canvas.width, canvas.height);
					const ctx3 = outputCanvas.getContext('2d');	
					ctx3.drawImage(img, 0, 0, outputCanvas.width, outputCanvas.height);
                };

			};
			reader.readAsDataURL(imageFile);
		}

        function scrollVerticalImage(event) {
            const value = event.target.value;
			const ctx = canvas.getContext('2d');

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(
                backupcanvas,
                0,
                value,
                canvas.width,
                canvas.height,
                0,
                0,
                canvas.width,
                canvas.height
            );
            ctx.drawImage(
                backupcanvas,
                0,
                0,
                canvas.width,
                value,
                0,
                canvas.height - value,
                canvas.width,
                value
            );
			updateOuput();
        }
		function scrollImage(event) {
            
			const value = event.target.value;
			const ctx = canvas.getContext('2d');
			const ctx2 = backupcanvas.getContext('2d');
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(
				backupcanvas,
				value,
				0,
				canvas.width,
				canvas.height,
				0,
				0,
				canvas.width,
				canvas.height
			);
			ctx.drawImage(
				backupcanvas,
				0,
				0,
				value,
				canvas.height,
				canvas.width - value,
				0,
				value,
				canvas.height
			);
			updateOuput();

		}

		function drawGraticules(numberOfLines = 4) {
			const ctx = overlay.getContext('2d');
			ctx.strokeStyle = 'lightblue';
			ctx.lineWidth = 1;
			const stepsize = overlay.width / numberOfLines;
			ctx.beginPath();
			for (let i = 0; i < overlay.width; i += stepsize) {
				ctx.moveTo(i, 0);
				ctx.lineTo(i, overlay.height);
			}
			for (let i = 0; i < overlay.height; i += stepsize / 2) {
				ctx.moveTo(0, i);
				ctx.lineTo(overlay.width, i);
			}
			ctx.stroke();

			ctx.strokeStyle = 'lightblue';
			ctx.lineWidth = 4;
			ctx.beginPath();
			ctx.moveTo(overlay.width / 2, 0);
			ctx.lineTo(overlay.width / 2, overlay.height);
			ctx.moveTo(0, overlay.height / 2);
			ctx.lineTo(overlay.width, overlay.height / 2);
			ctx.stroke();
		}



		{
			if (canvas && backupcanvas) {
				imageContainer.addEventListener('drop', drop);
				imageContainer.addEventListener('dragover', allowDrop);
				slider.addEventListener('input', scrollImage);
                vslider.addEventListener('input', scrollVerticalImage);
			}
		}
	});

	let draw = false;
	let startX = 0;
	let startY = 0;
	let endX = 0;
	let endY = 0;

	function handleMouseDown(event) {
		draw = true;
		startX = event.clientX - rect.left;
		startY = event.clientY - rect.top;
	}

	function handleMouseUp(event) {
		draw = false;
		updateOuput();
	}

	function handleMouseMove(event) {
		if (draw) {
			endX = event.clientX - rect.left;
			endY = event.clientY - rect.top;
			const ctx = overlay.getContext('2d');
			// draw a rectangle from the start position to the current position
			ctx.clearRect(0, 0, overlay.width, overlay.height);
			ctx.strokeStyle = 'red';
			ctx.lineWidth = 2;
			ctx.strokeRect(startX, startY, endX - startX, endY - startY);
		}
	}

	function resizeCanvas(){
		overlay.width = overlay.offsetWidth;
		overlay.height = overlay.offsetWidth*0.5;

		outputCanvas.width = canvas.width;
		outputCanvas.height = canvas.height;
	}

	window.onresize = function(){
		resizeCanvas();
	}

	function resetBoundingBox(){
		startX = 0;
		startY = 0;
		endX = 0;
		endY = 0;
		const ctx = overlay.getContext('2d');
		ctx.clearRect(0, 0, overlay.width, overlay.height);
		updateOuput();
	}

	
	function updateOuput(){
		// if the start,end postions are 0 just copy the whole image
		if(startX === 0 && startY === 0 && endX === 0 && endY === 0){
			const ctx = outputCanvas.getContext('2d');
			ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
			ctx.drawImage(canvas, 0, 0, outputCanvas.width, outputCanvas.height);
			return;
		}
		// todo: make this less.... chatgpt generated
		const ctx = outputCanvas.getContext('2d');
		ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
		// convert the start and end positions to the original image size
		const relstartX = startX / overlay.width * canvas.width;
		const relstartY = startY / overlay.height * canvas.height;
		const relendX = endX / overlay.width * canvas.width;
		const relendY = endY / overlay.height * canvas.height;
		// draw the selected part of the image to the output canvas, maintaining the aspect ratio
		const aspectRatio = (relendX - relstartX) / (relendY - relstartY);
		const outputWidth = outputCanvas.width;
		const outputHeight = outputCanvas.height;
		const outputAspectRatio = outputWidth / outputHeight;
		let drawWidth, drawHeight;
		if (aspectRatio > outputAspectRatio) {
			drawWidth = outputWidth;
			drawHeight = outputWidth / aspectRatio;
		} else {
			drawHeight = outputHeight;
			drawWidth = outputHeight * aspectRatio;
		}
		const drawX = 0;
		const drawY = (outputHeight - drawHeight) / 2;
		ctx.drawImage(canvas, relstartX, relstartY, relendX - relstartX, relendY - relstartY, drawX, drawY, drawWidth, drawHeight);
	}


</script>


<div class="container">
	<a href="/">return to main page</a>
	<h1>Sphere-ish 360° Video Artifacts</h1>

	<p>
		Convert equirectangular images to a net that you can cut, fold, and make into a little physical
		thing!
	</p>
</div>
<div class="grid-container halves">
    <div>
        <h2>input</h2>
        <div class="input-row">
            <div id="image-container">
                <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                <canvas bind:this={overlay} id="overlay" on:mousedown={handleMouseDown} on:mouseup={handleMouseUp} on:mousemove={handleMouseMove}></canvas>
                <canvas bind:this={canvas} width = "1000" height="500" ></canvas>
				
            </div>
            <div id="slider-container">
                <input type="range" id="v-slider" min="0" max="500" value="0" />
            </div>
        </div>
        <input type="range" id="slider" min="0" max="1000" value="0" />
		<button on:click={resetBoundingBox}>reset bounding box</button>
    </div>
	<div>
		<h2>output</h2>
		<canvas id="outputCanvas" bind:this={outputCanvas}></canvas>
	</div>
</div>
<canvas id="backupcanvas" bind:this={backupcanvas} width="1000" height="500"></canvas>

<style>
    .input-row {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
	#image-container {
		background-color: grey;
        position: relative;
        width: 100%;
		aspect-ratio: 2 / 1;
	}

	#image-container canvas {
		position: absolute; /* Overlap canvases */
		top: 0; /* Align to top of container */
		left: 0; /* Align to left of container */
		width: 100%; /* Take full width of container */
	}
    #overlay {
        z-index: 100;
    }
	#outputCanvas {
		width: 100%;
		background-color: grey;
	}
    

	#slider {
		width: 100%;
		cursor: pointer;
		overflow: hidden;
	}

	#backupcanvas {
		display: none;
	}
    #v-slider {
        writing-mode: vertical-lr; 
        direction: rtl;
        width: 8px; /* for IE */
        /* height: 100%; */
        /* margin: 0 auto; */
        display: flex;
        margin-left: 10px;
    }

</style>
