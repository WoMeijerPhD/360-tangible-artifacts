
<script>
// @ts-nocheck

	import { text } from '@sveltejs/kit';
    import { onMount } from 'svelte';

    // @ts-ignore
    let generatedImage = false;
    // @ts-ignore
    let textureData;
    // @ts-ignore

    // @ts-ignore
    let outputImageData;
    const referenceImage = new Image();
    referenceImage.src = '/poly/cube.png';
    let outputCanvas;


    const loadReferenceImage = (textureData) => {
        // Your existing loadReferenceImage function logic here
            // referenceImage.onload = function() {
                outputCanvas.width = referenceImage.width;
                outputCanvas.height = referenceImage.height;
                // outputCanvas.width = 500;
                // outputCanvas.height = 1000;
                const ctx = outputCanvas.getContext('2d');
                ctx.drawImage(referenceImage, 0, 0);
                const refImageData = ctx.getImageData(0, 0, referenceImage.width, referenceImage.height);
                const outputImageData = ctx.createImageData(referenceImage.width, referenceImage.height);

                // Maximum coordinates for the mapping
                const mapWidth = 4096;
                const mapHeight = 4096;

                // Process each pixel
                for (let i = 0; i < refImageData.data.length; i += 4) {
                    let r = refImageData.data[i]; // Red channel
                    let g = refImageData.data[i + 1]; // Green channel
                    let b = refImageData.data[i + 2]; // Blue channel
                    let a = refImageData.data[i + 3]; // Alpha channel

                    if (a === 0) {
                        // Skip transparent pixel
                        outputImageData.data[i] = 0
                        outputImageData.data[i + 1] =0
                        outputImageData.data[i + 2] = 0
                        outputImageData.data[i + 3] = 0
                        continue;
                    }

                    const highBitsX = r >> 4; // Top 4 bits of red channel
                    const highBitsY = r & 0x0F; // Lower 4 bits of red channel
                    const lowBitsX = g; // Entire green channel
                    const lowBitsY = b; // Entire blue channel

                    const decodedY = (highBitsX << 8) | lowBitsX; // Combine high and low bits for x
                    const decodedX = (highBitsY << 8) | lowBitsY; // Combine high and low bits for y
                    
                    // Normalize coordinates
                    const normX = decodedX / mapWidth;
                    const normY = decodedY / mapHeight;

                    // Scale normalized coordinates to texture dimensions
                    const textureX = Math.floor(normX * textureData.width);
                    const textureY = Math.floor(normY * textureData.height);

                    // Ensure texture coordinates are within the bounds
                    if (textureX < textureData.width && textureY < textureData.height) {
                        const index = (textureY * textureData.width + textureX) * 4;
                        outputImageData.data[i] = textureData.data[index]; // Red
                        outputImageData.data[i + 1] = textureData.data[index + 1]; // Green
                        outputImageData.data[i + 2] = textureData.data[index + 2]; // Blue
                        outputImageData.data[i + 3] = textureData.data[index + 3]; // Alpha (fully opaque)
                    } else {
                        outputImageData.data[i] = 0; // Set pixel to black if out of bounds
                        outputImageData.data[i + 1] = 0; // Set pixel to black if out of bounds
                        outputImageData.data[i + 2] = 0; // Set pixel to black if out of bounds
                        outputImageData.data[i + 3] = 0; // Set pixel to transparent if out of bounds
                    }
                }

                
                // // Draw the processed image
                ctx.putImageData(outputImageData, 0, 0);
                
                // set the output image to the processed image
                // outputImage.src = outputCanvas.toDataURL();
                setOutputImage();
                generatedImage = true;

            // };



    };

    // @ts-ignore
    const setOutputImage = () => {
        // Your existing setOutputImage function logic here
        const outputImgTag = document.getElementById('outputImage');

        const svgDoc = outputImgTag.contentDocument;

            // Now you can manipulate the SVG
            // For example, change the fill color of all paths to red
            const images = svgDoc.querySelectorAll('image');
            images.forEach(image => {
                console.log(image);
                //set the image href to the output image
                image.setAttribute('href', outputCanvas.toDataURL());
            });
    };

    const printSVG = () => {
        // Your existing printSVG function logic here
    };

    // @ts-ignore
    onMount(() => {
        const textureUpload = document.getElementById('textureUpload');
        // @ts-ignore
        outputCanvas = document.getElementById('outputCanvas');
        const inspinner = document.getElementById('inputSpinner');
        // @ts-ignore
        const outspinner = document.getElementById('outputSpinner');
        const inputImgTag = document.getElementById('inputImage');
        const outputImgTag = document.getElementById('outputImage');

        // @ts-ignore
        textureUpload.addEventListener('change', (event) => {
            // @ts-ignore
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                // @ts-ignore
                inspinner.style.display = 'block';

                const textureImg = new Image();
                textureImg.onload = () => {
                    // @ts-ignore
                    inputImgTag.src = textureImg.src;
                    // @ts-ignore
                    inputImgTag.style.display = 'block';

                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = textureImg.width;
                    canvas.height = textureImg.height;
                    // @ts-ignore
                    ctx.drawImage(textureImg, 0, 0);
                    // @ts-ignore
                    textureData = ctx.getImageData(0, 0, textureImg.width, textureImg.height);

                    // @ts-ignore
                    document.getElementById('generate').onclick = () => {
                        console.log('Generate button clicked');
                        // @ts-ignore
                        loadReferenceImage(textureData);
                    };

                    // @ts-ignore
                    inspinner.style.display = 'none';
                };
                // @ts-ignore
                textureImg.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });

        // Add event listeners to radio buttons
        const cubeRadio = document.getElementById('cube');
        // @ts-ignore
        cubeRadio.addEventListener('change', () => {
            // @ts-ignore
            outputImgTag.data = '/poly/cube.svg';
            // @ts-ignore
            referenceImage.src = '/poly/cube.png';
        });

        const polygonRadio = document.getElementById('polygon');
        // @ts-ignore
        polygonRadio.addEventListener('change', () => {
            // @ts-ignore
            outputImgTag.data = '/poly/polygon.svg';
            // @ts-ignore
            referenceImage.src = '/poly/polygon.png';
        });

        // Add event listener to print button
        const printButton = document.getElementById('print');
        // @ts-ignore
        printButton.addEventListener('click', () => {
            printSVG();
        });
    });
</script>

<style>
    .output{
        width: 100%;
    }
    .spinner {
        border: 16px solid #f3f3f3; /* Light grey */
        border-top: 16px solid #3498db; /* Blue */
        border-radius: 50%;
        width: 120px;
        height: 120px;
        animation: spin 2s linear infinite;
        display: none; /* Hide it initially */
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .grid-child{
        width: 100%;
    }

    #outputImage {
        width: 100%;
        height: auto;
    }
    #inputImage{
        width: 100%;
        height: auto;
    }

    #outputCanvas {
        display: none;
    }

    .header{
        margin: 0 auto;
    }
</style>

<div class="container">

        <h1>Equarec2Net</h1>

        <p>Convert equirectangular images to a net that you can cut, fold, and make into a little physical thing!</p>
</div>
<div class="grid-container thirds">
    <div class="input grid-child">
        <div id="input-controls">
            <input type="file" id="textureUpload" accept="image/*">
        </div>
        <div id="inputSpinner" class="spinner"></div>
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img id="inputImage" src="" alt="Input Image" style="display: none;">
    </div>
    <div class="controls grid-child" id="convert-controls">
            <div class="row">
                <input type="radio" id="cube" name="reference" value="cube" checked>
                <label for="cube">Cube</label>
            </div >
            <div class="row">
                <input type="radio" id="polygon" name="reference" value="polygon">
                <label for="polygon">Polygon</label>
            </div>
            <button id="generate">Generate</button>
            <button id="print">Print</button>
    </div>
    <div class="output u-full-width grid-child" id="output">
        <!-- svelte-ignore a11y-missing-attribute -->
        <object id="outputImage" data="/poly/cube.svg" type="image/svg+xml" alt="Output Image"></object>
        <div id="outputSpinner" class="spinner"></div>
    </div>
    <canvas id="outputCanvas"></canvas>
</div>
