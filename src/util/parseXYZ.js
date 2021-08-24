import { trim, capitalize, buildGeometry, parseLines } from '../util/util.js';
import { COVALENT_BOND, CPK } from '../util/constant.js';

export const parseXYZ = lines => {
	let x, y, z, index, e;
	let atoms = []; 
	let bonds = [];
	let histogram = {};

	let atomsCount = 2 + Number(lines[0]);
	for(var i = 2, l = atomsCount; i < l; i ++) {
		let line = parseLines(lines[i]);
		x = parseFloat(line[1]);
		y = parseFloat(line[2]);
		z = parseFloat(line[3]);
		index = i - 1;
		e = trim(lines[ i ].substr( 0, 2 )).toLowerCase();

		atoms[ index - 1 ] = [ x, y, z, CPK[e], capitalize(e) ];

		if ( histogram[ e ] === undefined ) {
			histogram[ e ] = 1;
		} else {
			histogram[ e ] += 1;
		}
	}

	var atomKeys = Object.keys(histogram);
		var atomKeysMap = {}
		for(var i = 0, l = atomKeys.length; i < l; i ++) {
			for(var j = i; j < l; j ++) {
				var code = atomKeys[i] + atomKeys[j];
				var h = (COVALENT_BOND[atomKeys[i]] + COVALENT_BOND[atomKeys[j]]) * 1.2 / 100;
				if(!atomKeysMap[code]) {
					atomKeysMap[code] = h;
				}
			}
		}

		for(var i = 2, l = atomsCount; i < l - 1; i ++ ) {
			for(var j = i + 1; j < l ; j ++ ) {
				let p1 = new THREE.Vector3(atoms[i - 2][0], atoms[i - 2][1], atoms[i - 2][2]);
				let p2 = new THREE.Vector3(atoms[j - 2][0], atoms[j - 2][1], atoms[j - 2][2]);
				let distance = p1.distanceTo(p2);
				let atom1 = (atoms[i - 2][atoms[i - 2].length - 1]).toLocaleLowerCase();
				let atom2 = (atoms[j - 2][atoms[j - 2].length - 1]).toLocaleLowerCase();
				let atomKey = atomKeysMap[atom1+atom2] || atomKeysMap[atom2+atom1];
				if(atomKey ) {
					if(distance < atomKey) {
						bonds.push([ i - 2 , j - 2, 1])
					} else {
						// console.log('原子没有连接关系')
					}
				} else {
					console.log('键长匹配出错了！！！')
				}
			}
		}

		return buildGeometry(atoms, bonds);
}