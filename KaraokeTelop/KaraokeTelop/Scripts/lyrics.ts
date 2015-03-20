class Word {

    offset: number;
    text: string;

    constructor(rawWord: string) {
        this.createLyricsWord(rawWord);
    }

    private createLyricsWord(rawWord) {
        var ary = rawWord.match(/^\[(\d+):(\d+):(\d+)\](.*)$/);

        this.text = ary[4];
        this.offset = ary[1] * 60000 + ary[2] * 1000 + ary[3] * 10;
    }
}

class Line {
    text: string;
    words: Array<Word>;

    // rawLine: '[00:00:00]word'
    constructor(rawLine: string) {
        this.text = rawLine.replace(/\[.+?\]/g, '');
        this.words = this.createRawWords(rawLine);
    }

    private createRawWords(rawLine) {
        var rawWords = [];

        var i1 = rawLine.indexOf("[");
        if (i1 < 0) {
            //
            return null;
        }

        var loop = true;
        while (loop) {

            var i2 = rawLine.indexOf("[", i1 + 1);
            if (i2 < 0) {
                i2 = rawLine.length;
                loop = false;
            }
            var word = new Word(rawLine.substr(i1, i2 - i1));
            rawWords.push(word);
            i1 = i2;
        }

        return rawWords;
    }
}

class Lyrics {

    lines: Array<Line> = [];

    constructor(fileText: string) {
        var lines = this.createRawLines(fileText);
        lines.forEach((line) => {
            this.lines.push(new Line(line));
        });
    }

    private createRawLines(fileText: string): Array<string> {

        // '[' 始まり以外の行を削除
        var fileLines = [];

        fileText.split("\n").forEach(function (line: string) {
            line = line.trim();
            if (line.length < 1 || line.substr(0, 1) != '[') {
                return;
            }
            fileLines.push(line);
        });

        // 行末にタグを付ける
        var rawLines = [];
        for (var i = 0; i < fileLines.length; i++) {
            var line = fileLines[i];

            if (line.substr(line.length - 1) != ']') {
                if (i < fileLines.length - 1 && fileLines[i + 1].trim().substr(0, 1) == '[') {
                    line += fileLines[i + 1].trim().substr(0, '[00:00:00]'.length);
                } else {
                    alert("failure");
                    return null;
                }
            }
            rawLines.push(line);
        }
        return rawLines;
    }
}