import { FileLoader, Loader } from './three.module.js'
import { parseMOL } from '../util/parseMOL.js';
import { parseXYZ } from '../util/parseXYZ.js';
import { parsePDB } from '../util/parsePDB.js';


class ModalLoader extends Loader {
	constructor(props) {
		super(props);
	}

	load(type, url, onLoad, onProgress, onError) {
		const loader = new FileLoader(this.manager);
		loader.setPath( this.path );
		loader.load( url, ( text ) => {
			onLoad( this.parse( text, type ) );
		}, onProgress, onError);
	}

	parse(text, type) {
		const lines = text.split( '\n' );
		switch(type) {
			case '.mol':
				return parseMOL(lines);
			case '.xyz':
				return parseXYZ(lines);
			case '.pdb':
				return parsePDB(lines);
			default:
				console.log('文件解析匹配出错了！！！')
		}
	}
}

export { ModalLoader }