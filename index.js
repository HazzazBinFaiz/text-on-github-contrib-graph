class TextWriter {
	constructor(options = {}) {
		this.max = options.max ?? 52;
		this.charLength = options.charLength ?? 4;
		this.gap = options.gap ?? 1;
		this.text = '';
		this.container = options.container ?? document.querySelector('svg.js-calendar-graph-svg');
	}

	calculateStringLength(){
		return (this.text.length * this.charLength) + ((this.text.length - 1) * this.gap);
	}

	calculateLeftPadding(){
		return Math.floor((this.max - this.calculateStringLength(this.text)) / 2);
	}

	getCharMap(char) {
		return {
			' ':[0,0,0,0],
			'A':[60,10,10,60],
			'B':[62,42,42,20],
			'C':[28,34,34,20],
			'D':[62,34,34,28],
			'E':[62,42,42,34],
			'F':[62,10,10,2],
			'G':[28,34,50,20],
			'H':[62,8,8,62],
			'I':[0,62,62,0],
			'J':[18,34,34,30],
			'K':[62,8,20,34],
			'L':[62,32,32,32],
			'M':[62,4,4,62],
			'N':[62,12,24,62],
			'O':[28,34,34,28],
			'P':[62,10,14,4],
			'Q':[28,34,50,60],
			'R':[62,10,26,36],
			'S':[36,42,42,18],
			'T':[2,62,62,2],
			'U':[30,32,32,30],
			'V':[30,48,48,30],
			'W':[62,16,16,62],
			'X':[34,28,28,34],
			'Y':[2,60,60,2],
			'Z':[50,58,46,38],
		}[char.toUpperCase()];
	}

	paintItem(item, focus = true) {
		if(focus) {
			item.style.fill = 'red';
		} else {
			item.style.fill = 'white';
		}
	}

	paintColumn(char, charposition, column){
		let data = this.getCharMap(char)[charposition];
		let row = 0;
		Array.from(column.children).forEach((item) => {
			if (data & (1 << row)) {
				this.paintItem(item)
			}
			row ++;
		});
	}

	render() {
		let cols = 0;
		let padding = this.calculateLeftPadding(this.text);
		let nChar = 0;
		let nPos = 0;
		Array.from(this.container.children[0].children).forEach((column) => {
			cols ++;
			if(cols <= padding) {
				return;
			}
			if(nChar < this.text.length) {
				if (nPos == ((this.charLength - 1) + this.gap)) {
					nChar ++;
					nPos = 0;
					return;
				}
				this.paintColumn(this.text[nChar], nPos, column);
				nPos ++;
			}
		});
	}

	clear() {
		Array.from(this.container.children[0].children).forEach((column) => {
			Array.from(column.children).forEach((item) => {
				this.paintItem(item, false);
			});
		});
	}

	writeOnGraph(text) {
		this.text = text.replace(/[^a-zA-Z\s]/g, '')
		this.clear();
		this.render();
	}

	static write(text, options = {}) {
		(new TextWriter(options)).writeOnGraph(text)
	}
}
