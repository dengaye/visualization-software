import { ModalLoader } from '../libs/ModalLoader.js';
import { CSS2DObject } from '../libs/CSS2DRenderer.js';
import ActionEvent from './actionEvent.js';
import { loading } from '../util/util.js';

var offset = new THREE.Vector3(0, 0, 0);

class LoadModal {
	constructor(props) {
		this.props = props;
		this.state = {
			threeGroup: new THREE.Group(),
			modalData: null,
			isOnlyRenderBonds: false,
			isOnlyRenderAtoms: false,
		}
		new ActionEvent({
			LoadModa: this,
			...props
		})
		props.scene.add(this.state.threeGroup);
	}

	loader(url, type) {
		const modalloader = new ModalLoader();
		this.state.isOnlyRenderBonds = false;
		this.state.isOnlyRenderAtoms = false;
		this.props.camera.position.z = 1000;
		modalloader.load(
			type,
			url,
			(data) => {
				if(data) {
					loading(false);
					this.state.modalData = data;
					this.resolveModal(data);
				}
			},
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},
			function ( error ) {
				loading(false);
				console.log( 'An error happened' );
		
			}
		)
	}
	render() {
	}

	resolveModal(data) {
		this.resetGroup();
		const { isOnlyRenderBonds, isOnlyRenderAtoms, modalData } = this.state;
		const { render } = this.props;
		data = data || modalData;
		!isOnlyRenderBonds	&& this.resolveAtoms(data);
		if(!isOnlyRenderAtoms && isOnlyRenderBonds) {
			this.resolveLineBonds(data)
		}
		if(!isOnlyRenderAtoms && !isOnlyRenderBonds) {
			this.resolveBonds(data)
		}
		render();
	}
	resolveAtoms(data) {
		const { threeGroup, isOnlyRenderAtoms } = this.state;
		const geometryAtoms = data.geometryAtoms;
		const json = data.json;
		const sphereGeometry = new THREE.SphereBufferGeometry(1, 32, 32);

		geometryAtoms.computeBoundingBox();
		!isOnlyRenderAtoms && geometryAtoms.boundingBox.getCenter( offset ).negate();
		!isOnlyRenderAtoms && geometryAtoms.translate( offset.x, offset.y, offset.z );

		let positions = geometryAtoms.getAttribute( 'position' );
		const colors = geometryAtoms.getAttribute( 'color' );

		const position = new THREE.Vector3();
		const color = new THREE.Color();

		for(let i = 0; i < positions.count; i ++) {
			position.x = positions.getX(i);
			position.y = positions.getY(i);
			position.z = positions.getZ(i);

			color.r = colors.getX( i );
			color.g = colors.getY( i );
			color.b = colors.getZ( i );

			const material = new THREE.MeshPhongMaterial( {
				color,
				side: THREE.DoubleSide 
			} );

			const object = new THREE.Mesh( sphereGeometry, material );
			object.position.copy( position );
			object.position.multiplyScalar( 75 );
			object.scale.multiplyScalar( 25 );
			threeGroup.add( object );
			
			const atom = json.atoms[ i ];

			const text = document.createElement( 'div' );
			text.className = 'label';
			text.style.color = 'rgb(' + atom[ 3 ][ 0 ] + ',' + atom[ 3 ][ 1 ] + ',' + atom[ 3 ][ 2 ] + ')';
			// text.textContent = atom[ 4 ];
			// text.textContent = `${atom[ 4 ]} ${i + 1}`;
			text.textContent = i + 1;
			const label = new CSS2DObject( text );
			label.position.copy( object.position );
			threeGroup.add(label)
		}
	}

	resolveBonds(data) {
		const { threeGroup, isOnlyRenderBonds } = this.state;
		const geometryBonds = data.geometryBonds;
		const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
		const { bonds } = data.json;
		!isOnlyRenderBonds && geometryBonds.translate( offset.x, offset.y, offset.z );
		let defaultScale = 3;
		const positions = geometryBonds.getAttribute( 'position' );
		var start = new THREE.Vector3();
		var end = new THREE.Vector3();
		var bHash = {};
		for ( var i = 0, j = 0; i < positions.count; i += 2, j++ ) {
			let bond = bonds[j].join('');
			
			start.x = positions.getX( i );
			start.y = positions.getY( i );
			start.z = positions.getZ( i );

			end.x = positions.getX( i + 1 );
			end.y = positions.getY( i + 1 );
			end.z = positions.getZ( i + 1 );

			if(bHash[bond]) {
				start.z = start.z - 0.1;
				start.y = start.y + 0.1;
				end.z = end.z - 0.1;
				end.y = end.y + 0.1;
			} else {
				bHash[bond] = bond;
			}
			createBox(start, end)
		}

		function createBox(start, end, scale = defaultScale, multiplyScalar1 = 75, multiplyScalar2 = 75) {
			start.multiplyScalar( multiplyScalar1 );
			end.multiplyScalar( multiplyScalar2 );
			var object = new THREE.Mesh( boxGeometry, new THREE.MeshPhongMaterial( 0xffffff ) );
			object.position.copy( start );
			object.position.lerp( end, 0.5 );
			object.scale.set( scale, scale, start.distanceTo( end ) );
			object.lookAt( end );
			threeGroup.add(object);
		}
	}

	resolveLineBonds(data) {
		const { threeGroup, isOnlyRenderBonds } = this.state;
		const geometryBonds = data.geometryBonds;
		const { bonds } = data.json;
		!isOnlyRenderBonds && geometryBonds.translate( offset.x, offset.y, offset.z );

		const positions = geometryBonds.getAttribute( 'position' );
		let end = new THREE.Vector3(), start = new THREE.Vector3();
		let bHash = {};

		for(let i = 0, j = 0, l = positions.count; i < l; i += 2, j ++) {
			let bond = bonds[j].join('');
			start.x = positions.getX( i );
			start.y = positions.getY( i );
			start.z = positions.getZ( i );

			end.x = positions.getX( i + 1 );
			end.y = positions.getY( i + 1 );
			end.z = positions.getZ( i + 1 );
			

			if(bHash[bond]) {
				start.z = start.z + 0.1;
				start.x = start.x + 0.1;
				start.y = start.y - 0.1;
				end.z = end.z + 0.1;
				end.x = end.x + 0.1;
				end.y = end.y - 0.1;
			} else {
				bHash[bond] = bond;
			}
			createLine(start, end);

			function createLine(start, end) {
				let vertices = []
				vertices.push(start);
				vertices.push(end);
				let material = new THREE.LineBasicMaterial({
					color:0xffffff,
				});
				let geometry = new THREE.BufferGeometry().setFromPoints( vertices );
				let line = new THREE.Line( geometry, material );
				line.scale.x = 76;
				line.scale.y = 78;
				line.scale.z = 78;
				threeGroup.add( line );
			}
		}
	}

	resetGroup() {
		const { threeGroup } = this.state;
		while(threeGroup.children.length > 0) {
			var object = threeGroup.children[0];
			object.parent.remove(object);
		}
	}
}



export default LoadModal;