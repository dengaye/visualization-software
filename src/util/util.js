import {
  BufferGeometry,
  Float32BufferAttribute,
} from "../libs/three.module.js";
import { SUPPORT_FILE_EXTEND } from './constant.js';

export const trim = (text) => {
  return text.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
};

export const capitalize = (text) => {
  return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
};

export const buildGeometry = (atoms = [], bonds = [] ) => {
  var build = {
    geometryAtoms: new BufferGeometry(),
    geometryBonds: new BufferGeometry(),
    json: {
      atoms: atoms,
      bonds: bonds,
    },
  };
  var geometryAtoms = build.geometryAtoms;
  var geometryBonds = build.geometryBonds;

  var i, l;

  var verticesAtoms = [];
  var colorsAtoms = [];
  var verticesBonds = [];
  // atoms
  for (i = 0, l = atoms.length; i < l; i++) {
    var atom = atoms[i];

    var x = atom[0];
    var y = atom[1];
    var z = atom[2];

    verticesAtoms.push(x, y, z);

    var r = atom[3][0] / 255;
    var g = atom[3][1] / 255;
    var b = atom[3][2] / 255;

    colorsAtoms.push(r, g, b);
	}
	
	// bonds

	for ( i = 0, l = bonds.length; i < l; i ++ ) {

		var bond = bonds[ i ];

		var start = bond[ 0 ];
		var end = bond[ 1 ];

		verticesBonds.push( verticesAtoms[ ( start * 3 ) + 0 ] );
		verticesBonds.push( verticesAtoms[ ( start * 3 ) + 1 ] );
		verticesBonds.push( verticesAtoms[ ( start * 3 ) + 2 ] );

		verticesBonds.push( verticesAtoms[ ( end * 3 ) + 0 ] );
		verticesBonds.push( verticesAtoms[ ( end * 3 ) + 1 ] );
		verticesBonds.push( verticesAtoms[ ( end * 3 ) + 2 ] );

	}

  // build geometry

  geometryAtoms.setAttribute(
    "position",
    new Float32BufferAttribute(verticesAtoms, 3)
  );
  geometryAtoms.setAttribute(
    "color",
    new Float32BufferAttribute(colorsAtoms, 3)
  );

  geometryBonds.setAttribute(
    "position",
    new Float32BufferAttribute(verticesBonds, 3)
  );

  return build;
};

export const getFileExtendingName  = (filename) => {
  // 文件扩展名匹配正则
  var reg = /\.[^\.]+$/;
  var matches = reg.exec(filename);
  if (matches) {
    return matches[0];
  }
  return '';
}

export const isSupportFile = (url) => {
  const fileExtend = getFileExtendingName(url);
  return SUPPORT_FILE_EXTEND.indexOf(fileExtend) > -1;
}

export const loading = (flag = true) => {
  const loadingDOM = document.getElementById('loading');
  if(flag) {
    loadingDOM.style.display = 'block';
  } else {
    loadingDOM.style.display = 'none';
  }
}

export const parseLines = line => {
  return line.split(' ').filter(item => item !== '')
}