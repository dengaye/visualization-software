import loadModal from "./module/loadModal.js";
import { TrackballControls } from "./libs/TrackballControls.js";
import { getFileExtendingName } from "./util/util.js";
import { CSS2DRenderer } from './libs/CSS2DRenderer.js';

const defaultUrl = './src/resouce/ho.xyz';

(function() {
  const rootDOM = document.getElementById('root');
  let WIDTH = rootDOM.offsetWidth;
  let HEIGHT = rootDOM.offsetHeight;
  start();

  var camera, scene, renderer, controls, labelRenderer, loaderModal; 
  
  function start() {
    scene = new THREE.Scene();

    initCamera();
    initLight();
    initRender();
    initControl();
    initCSS2DRender();

    loaderModal = new loadModal({
      scene,
      camera,
      renderer,
      render,
      WIDTH,
      HEIGHT,
    });

    reloaderModal(defaultUrl)

    animate();
    resize()
    
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      render();
    }
  }
  function render() {
    labelRenderer.render(scene, camera);
    renderer.render(scene, camera);
  }

  function reloaderModal(url) {
    const type = getFileExtendingName(url);
    loaderModal.loader(url, type);
  }

  function resize () {
    window.addEventListener('resize', function() {
      WIDTH = rootDOM.offsetWidth;
      HEIGHT = rootDOM.offsetHeight;

      renderer.setSize(WIDTH, HEIGHT);
      labelRenderer.setSize( WIDTH, HEIGHT );

      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix();
      render();
    })
  }

  function initCamera() {
    camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 5000);
    camera.position.z = 1000;
    scene.add(camera);
  }

  function initLight() {
    scene.add( new THREE.AmbientLight( 0xdddddd ) );

    let light = new THREE.PointLight( 0x000000, 1 );
    camera.add( light );
  }

  function initRender() {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    renderer.setClearColor (0x000000, 1.0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);
    rootDOM.appendChild(renderer.domElement);
  }

  function initControl() {
    controls = new TrackballControls(camera, renderer.domElement);
    controls.minDistance = 100;
    controls.maxDistance = 1000;
    controls.dynamicDampingFactor = 0.1;
    controls.rotateSpeed = 2.0;
    controls.zoomSpeed = 8.2;
    controls.panSpeed = 10.9;
  }

  function initCSS2DRender () {
    labelRenderer = new CSS2DRenderer()
		labelRenderer.setSize( WIDTH, HEIGHT );
		labelRenderer.domElement.style.position = 'absolute';
		labelRenderer.domElement.style.top = '0';
		labelRenderer.domElement.style.pointerEvents = 'none';
		rootDOM.appendChild( labelRenderer.domElement );
	}

})();
