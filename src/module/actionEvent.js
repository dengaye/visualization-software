import { isSupportFile, getFileExtendingName, loading } from "../util/util.js";

class ActionEvent {
	constructor(props) {
		this.props = props;
		this.handleUploadFile();
		this.handleActionBtn();
		this.handleTheme();
		this.handleTestModal();
	}

	handleActionBtn() {
		const actionContentDOM = document.getElementById('actionContent');
		actionContentDOM.addEventListener('click', (e) => {
			const targetID =  e.target.id;
			switch(targetID) {
				case 'lineBtn': 
					this.handleLine();
					break;
				case 'resetBtn':
					this.hanleReset();
					break;
				case 'sphereBtn':
					this.hanleSphere();
					break;
				default: 
					break;
			}
		})
	}

	handleTheme() {
		const themeDOM = document.getElementById('theme');
		const bodyDOM = document.body;
		themeDOM.addEventListener('click', (e) => {
			const targetID =  e.target.id;
			if(targetID == 'lightThemeBtn' && bodyDOM.className !== 'light-theme') {
				bodyDOM.className = 'light-theme';
				this.props.renderer.setClearColor(0xffffff, 1);
			} 
			if(targetID == 'darkThemeBtn' && bodyDOM !== 'dark-theme') {
				this.props.renderer.setClearColor(0x000000, 1);
				bodyDOM.className = 'dark-theme';
			}
		})
	}

	handleUploadFile() {
    const fileDOM = document.getElementById('uploadFile');
    fileDOM.addEventListener('change', (e) => {
      const path = e.target.files[0].path;
      if(isSupportFile(path)) {
				loading();
				this.props.LoadModa.loader(path, getFileExtendingName(path));
      } else {
        alert("只支持三种格式 MOL | XYZ | PDB ");
      }
    })
  }

	handleTestModal() {
		const testModalDOM = document.getElementById('testModal');
		const demoList = ['./src/resouce/ho.xyz', './src/resouce/MolView.mol', './src/resouce/demo.xyz']
		const demoListType = ['.xyz', '.mol', '.xyz']
		testModalDOM.addEventListener('click', (e) => {
			const targetName = e.target;
			const attribute = targetName.getAttribute('data-index');
			this.props.LoadModa.loader(demoList[attribute], demoListType[attribute])
		})
	}

	handleLine() {
		let { state } = this.props.LoadModa;
		if(!state.isOnlyRenderBonds) {
			state.isOnlyRenderBonds = true;
			state.isOnlyRenderAtoms = false;
			this.props.LoadModa.resolveModal()
		}
	}

	hanleReset() {
		let { state } = this.props.LoadModa;
		if(state.isOnlyRenderBonds || state.isOnlyRenderAtoms) {
			state.isOnlyRenderBonds = false;
			state.isOnlyRenderAtoms = false;
			this.props.LoadModa.resolveModal()
		}
	}

	hanleSphere() {
		let { state } = this.props.LoadModa;
		if(!state.isOnlyRenderAtoms) {
			state.isOnlyRenderBonds = false;
			state.isOnlyRenderAtoms = true;
			this.props.LoadModa.resolveModal()
		}
	}
}

export default ActionEvent;
