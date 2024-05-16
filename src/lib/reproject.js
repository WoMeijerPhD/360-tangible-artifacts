// @ts-nocheck

import * as d3 from 'd3-geo';
// import {aitoffRaw} from 'd3-geo-projection';

export function reprojectImage(inputCanvas, outputCanvas,projection) {


    const width = inputCanvas.width;
    const height = inputCanvas.height;
    console.log('reprojectImage', width, height, projection);
    
    let targetData = new Uint8ClampedArray(width * height * 4);
    // get source data from canvas
    let sourceData = inputCanvas.getContext('2d').getImageData(0, 0, width, height).data;

    let dx = width, dy = height;

    projection = d3.geoAlbers();
    // reproject image
    for (var y = 0, i = -1; y < height; ++y) {
        for (var x = 0; x < width; ++x) {
            var p = projection.invert([x, y]), λ = p[0], φ = p[1];
            if (λ > 180 || λ < -180 || φ > 90 || φ < -90) { i += 4; continue; }
            var q = ((90 - φ) / 180 * dy | 0) * dx + ((180 + λ) / 360 * dx | 0) << 2;
            targetData[++i] = sourceData[q];
            targetData[++i] = sourceData[++q];
            targetData[++i] = sourceData[++q];
            targetData[++i] = 255;
        }
    }
    // put target data to canvas
    outputCanvas.getContext('2d').putImageData(new ImageData(targetData, width, height), 0, 0);

}