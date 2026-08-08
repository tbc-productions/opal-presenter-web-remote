/**
 * ChordProPipe
 *
 * A pipe for angular 2/4 that translate ChordPro-formatted text into an HTML representation, to be used in conjunction with a set of styles
 * for proper display.
 *
 * If you make improvements, please send them to me for incorporation.
 *
 * @author David Quinn-Jacobs (dqj@authentrics.com)
 * @licence Use this in any way you like, with no constraints.
 */
import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'chordpro',
  standalone: false
})

export class ChordProPipe implements PipeTransform {
  private sanitizer: DomSanitizer = inject(DomSanitizer);

  /**
  * @var chordRegex Expression used to determine if given line contains a chord.
  * @type {RegExp}
  */
  private chordRegex = /\[([^\]]*)\]/;
  private readonly MAX_HALF_STEPS = 11;

  constructor() {
    this.notesSharpNotation['german'] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'H'];
    this.notesFlatNotation['german'] = ['C', 'Db', 'D', 'Eb', 'Fb', 'F', 'Gb', 'G', 'Ab', 'A', 'B', 'H'];
    this.notesSharpNotation['english'] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    this.notesFlatNotation['english'] = ['C', 'Db', 'D', 'Eb', 'Fb', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  }

  private keys = [
    { name: 'Ab', value: 0 },
    { name: 'A', value: 1 },
    { name: 'Bb', value: 2 },
    { name: 'A#', value: 2 },
    { name: 'B', value: 3 },
    { name: 'C', value: 4 },
    { name: 'C#', value: 5 },
    { name: 'Db', value: 5 },
    { name: 'D', value: 6 },
    { name: 'Eb', value: 7 },
    { name: 'D#', value: 7 },
    { name: 'E', value: 8 },
    { name: 'F', value: 9 },
    { name: 'F#', value: 10 },
    { name: 'Gb', value: 10 },
    { name: 'G', value: 11 },
    { name: 'G#', value: 0 }
  ];
  notesSharpNotation: Record<string, string[]> = {};
  notesFlatNotation: Record<string, string[]> = {};

  decodeHTML(value: string) {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = value;
    return tempElement.innerText;
  }

  /**
  * Pipe transformation for ChordPro-formatted song texts.
  *
  * @param {string} song
  * @param {number} nHalfSteps
  * @returns {string}
  */
  transform(song: string/*, nHalfSteps: number*/): string|SafeHtml {
    // we hardcode nHalfSteps to 0, since the transposing is not used in OpenLP web
    const nHalfSteps = 0;
    try {
      if (song !== undefined && song) {
        return this.sanitizer.bypassSecurityTrustHtml(this.parseToHTML(song, nHalfSteps));
      }
    }
    catch (exception) {
      console.warn('chordpro translation error', exception);
    }
    return song;
  }

  chordRoot(chord: string): string {
    let root = '';
    let ch2 = '';
    if (chord && chord.length > 0) {
      root = chord.substr(0, 1);
      if (chord.length > 1) {
        ch2 = chord.substr(1, 1);
        if (ch2 === 'b' || ch2 === '#') {
          root += ch2;
        }
      }
    }
    return root;
  }

  restOfChord(chord: string): string {
    let rest = '';
    const root = this.chordRoot(chord);
    if (chord.length > root.length) {
      rest = chord.substr(root.length);
    }
    return rest;
  }

  /**
  * Transpose the given chord the given (positive or negative) number of half steps.
  *
  * @param {string} chordRoot
  * @param {number} nHalfSteps
  * @returns {string}
  */
  transposeChord(chordRoot: string, nHalfSteps: number): string {
    let pos = -1;
    for (const key of this.keys) {
      if (key.name === chordRoot) {
        pos = key.value;
        break;
      }
    }
    if (pos >= 0) {
      pos += nHalfSteps;
      if (pos < 0) {
        pos += this.MAX_HALF_STEPS;
      } else if (pos > this.MAX_HALF_STEPS) {
        pos -= this.MAX_HALF_STEPS + 1;
      }
      for (const key of this.keys) {
        if (key.value === pos) {
          return key.name;
        }
      }
    }
    return chordRoot;
  }

  /**
  * Parse a string containing a ChordPro-formatted song, building an array of output HTML lines.
  *
  * @param {number} nHalfSteps
  * @param {string} song
  */
  private parseToHTML(song: string, nHalfSteps = 0): string {
    // we are currently receiving html, we need to replace that stuff,
    // becuase it gets messed up when a chord is placed on it..
    // shouldn't be relevant if we actually get chordpro format
    song = this.decodeHTML(song);
    if (!song) {
      return '';
    }
    let chordText = '';
    if (!song.match(this.chordRegex)) {
      return `<div class="no-chords">${song}</div>`;
    }

    // Processing backwards so we can better identify where chords should overlap lyric letters
    // or insert a space in lyrics
    song.split(/\n/).reverse().forEach(
      (row, index) => {
        chordText = `</div>${index > 0 ? '<br>' : ''}` + chordText;
        const rowParts = row.split(this.chordRegex);
        let lastPart;

        for (let i = rowParts.length - 1, r = 0, isFirst = true; i >= 0; i--, r++ ) {
          if (!isFirst) {
            const isOpeningChord = (i === 1) && (rowParts[0].length === 0);
            chordText = this._processChordRow(nHalfSteps, rowParts[i], i, lastPart || '', r, isOpeningChord) + chordText;
          }

         lastPart = rowParts[i];
         isFirst = false;
        }

        chordText = '<div class="song-row">' + chordText;
      }
    );
    return `<div class="with-chords">${chordText}</div>`;
  }

  protected _processChordRow(nHalfSteps: number, part: string, index: number, lastPart: string, reverseIndex: number,
      isOpeningChord = false) {
    if (index % 2 !== 0) {
      if (index > 0) {
        // chord
        let chord = part.replace(/[[]]/, '');
        if (nHalfSteps !== 0) {
          chord = chord.split('/').map(
            (chordPart: string) => {
              const chordRoot = this.chordRoot(chordPart);
              const newRoot = this.transposeChord(chordRoot, nHalfSteps);
              return newRoot + this.restOfChord(chordPart);
            }
          ).join('/');
        }

        // use proper symbols
        chord = chord.replace(/b/g, '♭');
        chord = chord.replace(/#/g, '♯');
        const textFirstLetter = `${lastPart.substring(0, 1)}`;
        const textRest = lastPart.substring(1);
        const isChordMusicKey = chord.startsWith('=');
        const chordLength = chord.length;
        const isFirstChordAfterRealWord = (lastPart.length && (reverseIndex === 1));
        const shouldOverlapChord = isOpeningChord || isFirstChordAfterRealWord ||
          ((!isChordMusicKey) && (lastPart.length > chord.length));
        const isChordOnly = !lastPart.trim().length;

        const chordClass = (shouldOverlapChord && 'overlap-chord' || '') + (isChordOnly && ' chord-only' || '');

        const textLength = 1 + textRest.length;
        const fillHtmlNeededLength = (!shouldOverlapChord && (textLength < chordLength)) ? chordLength - 1 : (chordLength - 1);
        let fillHtml = !shouldOverlapChord && !isChordMusicKey ? this._makeFillHtml(fillHtmlNeededLength || 1) : '';
        let fillHtmlLength = fillHtml?.length ?? 0;
        const finalTextLength = 1 + textRest.length + fillHtmlLength;
        const needExtraFill = (!shouldOverlapChord && (finalTextLength <= chordLength));

        if (needExtraFill) {
          fillHtml = this._makeFillHtml(fillHtmlLength + 1);
          fillHtmlLength++;
          chord += ' ';
        }

        if (!lastPart || (textFirstLetter === ' ')) {
          fillHtml = ' '.repeat(fillHtmlLength);
        }

        if ((fillHtmlLength === 1 && chordLength < 2)) {
          // To match text separator
          chord += ' ';
        }

        return `<span data-chord="${chord}" class="${chordClass}">` +
               `<span class="chord">${chord}</span>` +
               `<span class="text ${fillHtml ? 'with-fill' : ''}">` +
               `<span class="first-letter">${textFirstLetter}</span>` +
               `${fillHtml}` +
               `</span>` +
               `</span>${textRest}`;
      } else {
        return `${lastPart}`;
      }
    }
    return '';
  }

  protected _makeFillHtml(length: number): string {
    if (length >= 3) {
      let text = '';
      const middle = Math.floor(length / 2);

      for (let i = 0; i < length; i++) {
        text += (i === middle) ? '\u2014' : ' ';
      }

      return text;
    } else {
      return '\u00B7' + (length === 2 ? ' ' : '');
    }
  }
}
