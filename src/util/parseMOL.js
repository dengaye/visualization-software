import { trim, capitalize, buildGeometry, parseLines } from './util.js';
import { CPK } from './constant.js';

export const parseMOL = lines => {
	var x, y, z, index, e;
	var atoms = []; 
	var bonds = [];
	var histogram = {};
	const countsLine = parseLines(lines[3]);

	// atom block
	let atomsCount = Number(countsLine[0]) + 4;
	for(let i = 4, l = atomsCount; i < l; i ++) {
		let line = parseLines(lines[i]);
		x = parseFloat(line[0]);
		y = parseFloat(line[1]);
		z = parseFloat(line[2]);
		index = i - 3;
		e = trim(line[3]).toLowerCase();

		atoms[ index - 1 ] = [ x, y, z, CPK[e], capitalize(e) ];

		if ( histogram[ e ] === undefined ) {
			histogram[ e ] = 1;
		} else {
			histogram[ e ] += 1;
		}
	}

	var bhash = {};
	function hash( s, e ) {

		return 's' + Math.min( s, e ) + 'e' + Math.max( s, e );

	}
	function parseBond( satom, index ) {
		if ( index ) {

			// 记录原子之间的连接情况
			var h = hash( satom, index ); 

			// 如果已经在bonds中，就不应该再添加
			if ( bhash[ h ] === undefined ) {
				bonds.push( [ satom - 1, index - 1, 1 ] );
				bhash[ h ] = bonds.length - 1;
			}

		}

	}

	let bondCount = atomsCount + Number(countsLine[1]);
	for(let i = Number(countsLine[0]) + 4, l = bondCount; i < l; i ++) {
		let line = lines[i].split(' ').filter(item=>item!='' && item !== '0');
		parseBond( Number(line[0]), Number(line[1]))
		if(line[2] > 1) {
			for(let j = 1, jl = line[2]; j < jl; j ++) {
				bonds.push([ Number(line[0]) - 1, Number(line[1]) - 1, 1]);
			}
		}
	}

	return buildGeometry(atoms, bonds);
}