// @ts-nocheck

import * as d3 from 'd3-geo';
import { context } from 'three/examples/jsm/nodes/Nodes.js';

export function mask(outputCanvas, projection){
    const width = outputCanvas.width;
    const height = outputCanvas.height;
    const context = outputCanvas.getContext('2d');

    let path = d3.geoPath().context(context).projection(projection);
    
    context.beginPath();
    context.strokeStyle = "#ccc";
    path({type: "Sphere", orientation:"counterclockwise"})
    context.stroke();
    context.clip();
   
    return;
    
}



export function reprojectImage(inputCanvas, outputCanvas,projection) {
    
    const width = outputCanvas.width;
    const height = outputCanvas.height;

    // make sure the projection is set properly
    projection = projection.fitSize([width, height], {type: "Sphere"})

    
    let targetData = new Uint8ClampedArray(width * height * 4);
    // get source data from canvas
    let sourceData = inputCanvas.getContext('2d').getImageData(0, 0, width, height).data;

    let dx = width, dy = height;

    // reproject image
    for (var y = 0, i = -1; y < height; ++y) {
        for (var x = 0; x < width; ++x) {
            var p = projection.invert([x, y]), λ = p[0], φ = p[1];
            if (λ > 180 || λ < -180 || φ > 90 || φ < -90) { 
                // if it is out of bounds, skip it
                i+=4;
                continue; 
            }
            var q = ((90 - φ) / 180 * dy | 0) * dx + ((180 + λ) / 360 * dx | 0) << 2;

            targetData[++i] = sourceData[q];
            targetData[++i] = sourceData[++q];
            targetData[++i] = sourceData[++q];
            targetData[++i] = 255;
        }
    }
    const context = outputCanvas.getContext('2d');
    // clear the image
    context.clearRect(0, 0, width, height);

    // mask the image
    let path = d3.geoPath().context(context).projection(projection);
    context.save();
    context.beginPath();
    context.strokeStyle = "#ccc";
    path({type: "Sphere"})
    context.stroke();
    context.clip();

    // make a virtual canvas
    let outputImg = new ImageData(targetData, width, height);
    let newOutput = document.createElement('canvas');
    newOutput.width = width;
    newOutput.height = height;
    let newContext = newOutput.getContext('2d');
    newContext.putImageData(outputImg, 0, 0);

    // put target data to canvas
    context.drawImage(newOutput, 0, 0);
    context.restore();
    // delete the virtual canvas
    newOutput.remove();



}
