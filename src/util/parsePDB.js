import { trim, capitalize, buildGeometry } from './util.js';
import { CPK } from './constant.js';

export const parsePDB = lines => {
	function hash( s, e ) {

		return 's' + Math.min( s, e ) + 'e' + Math.max( s, e );

	}
	function parseBond( start, length ) {

		var eatom = parseInt( lines[ i ].substr( start, length ) );
		if ( eatom ) {

			// 记录原子之间的连接情况
			var h = hash( satom, eatom ); 

			// 如果已经在bonds中，就不应该再添加
			if ( bhash[ h ] === undefined ) {

				bonds.push( [ satom - 1, eatom - 1, 1 ] );
				bhash[ h ] = bonds.length - 1;

			} else {

				// doesn't really work as almost all PDBs
				// have just normal bonds appearing multiple
				// times instead of being double/triple bonds
				// bonds[bhash[h]][2] += 1;

			}

		}

	}

	var atoms = [];
	var bonds = [];
	var histogram = {};

	var bhash = {};

	var x, y, z, index, e;

	for ( var i = 0, l = lines.length; i < l; i ++ ) {

		if ( lines[ i ].substr( 0, 4 ) === 'ATOM' || lines[ i ].substr( 0, 6 ) === 'HETATM' ) {

			x = parseFloat( lines[ i ].substr( 30, 7 ) );
			y = parseFloat( lines[ i ].substr( 38, 7 ) );
			z = parseFloat( lines[ i ].substr( 46, 7 ) );
			index = parseInt( lines[ i ].substr( 6, 5 ) ) - 1;

			e = trim( lines[ i ].substr( 76, 2 ) ).toLowerCase();

			if ( e === '' ) {

				e = trim( lines[ i ].substr( 12, 2 ) ).toLowerCase();
			}

			atoms[ index ] = [ x, y, z, CPK[ e ], capitalize( e ) ];

			if ( histogram[ e ] === undefined ) {

				histogram[ e ] = 1;

			} else {

				histogram[ e ] += 1;

			}

		} else if ( lines[ i ].substr( 0, 6 ) === 'CONECT' ) {

			var satom = parseInt( lines[ i ].substr( 6, 5 ) );

			parseBond( 11, 5 );
			parseBond( 16, 5 );
			parseBond( 21, 5 );
			parseBond( 26, 5 );

		}

	}
	return buildGeometry(atoms, bonds);
}