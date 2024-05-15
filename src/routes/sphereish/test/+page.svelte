<script>
    // @ts-nocheck
    
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import { TextureLoader,  EquirectangularReflectionMapping } from 'three';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import { color } from 'three/examples/jsm/nodes/Nodes.js';

    
    
      let camera, scene, renderer, canvas;
      let textureEquirec, sphereMesh, sphereMaterial;
    
      onMount(() => {
        init();
        animate();
      });
    
      function init() {
        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(0, 0, 2.5);
    
        scene = new THREE.Scene();
    
        const textureLoader = new TextureLoader();
        textureEquirec = textureLoader.load('/test.jpeg');
        textureEquirec.mapping = EquirectangularReflectionMapping;
        textureEquirec.colorSpace = THREE.SRGBColorSpace;

        scene.background = textureEquirec; 

        // scene.background = textureEquirec;
        let geometry;
        // const geometry = new THREE.IcosahedronGeometry(1, 0);
        // import the geometry from /test.glb
        let loader = new GLTFLoader();
        loader.load('/test.glb', function (gltf) {
            geometry = gltf.scene.children[0].geometry;
            console.log(geometry);
            // get the uv attribute
        // });

        
        
        // const geometry = new THREE.IcosahedronGeometry( 1, 0 );
        sphereMaterial = new THREE.MeshBasicMaterial({ map: textureEquirec, side: THREE.DoubleSide});
        // sphereMaterial = new THREE.MeshBasicMaterial({ color    : 0x00ff00});
        sphereMesh = new THREE.Mesh(geometry, sphereMaterial);
        scene.add(sphereMesh);
        // add a wireframe outline to the mesh
        const wireframe = new THREE.WireframeGeometry(geometry);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 3 });
        const line = new THREE.LineSegments(wireframe, lineMaterial);
        sphereMesh.add(line);
        console.log(sphereMesh);
        });
    
        canvas = document.querySelector('canvas');
    
        renderer = new THREE.WebGLRenderer({canvas:canvas});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
    
        // add orbit controls
        const controls = new OrbitControls(camera, renderer.domElement);
    
        // document.body.appendChild(renderer.domElement);
    
        window.addEventListener('resize', onWindowResize);
      }
    
      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    
      function animate() {
        requestAnimationFrame(animate);
        render();
      }
    
      function render() {
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
      }
    </script>
    
    <style>
      canvas {
        display: block;
        width: 100%;
        height: 100%;
        touch-action: none;
      }
    </style>
    
    <canvas bind:this={renderer} />
    