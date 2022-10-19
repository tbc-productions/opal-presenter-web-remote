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
import { Pipe, PipeTransform } from '@angular/core';
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY } from '@angular/material/autocomplete';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'chordpro' })

export class ChordProPipe implements PipeTransform {
    /**
     * @var chordRegex Expression used to determine if given line contains a chord.
     * @type {RegExp}
     */
    private chordRegex = /\[([^\]]*)\]/;
    private readonly MAX_HALF_STEPS = 11;

    constructor(private sanitizer: DomSanitizer) {
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
    notesSharpNotation = {};
    notesFlatNotation = {};

    decodeHTML(value: string) {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = value;
        return tempElement.innerText;
    }

    /**
     * Pipe transformation for ChordPro-formatted song texts.
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
            else {
                return song;
            }
        }
        catch (exception) {
            console.warn('chordpro translation error', exception);
        }
    }

    chordRoot(chord) {
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

    restOfChord(chord) {
        let rest = '';
        const root = this.chordRoot(chord);
        if (chord.length > root.length) {
            rest = chord.substr(root.length);
        }
        return rest;
    }

    /**
     * Transpose the given chord the given (positive or negative) number of half steps.
     * @param {string} chordRoot
     * @param {number} nHalfSteps
     * @returns {string}
     */
    transposeChord(chordRoot, nHalfSteps) {
        let pos = -1;
        for (let i = 0; i < this.keys.length; i++) {
            if (this.keys[i].name === chordRoot) {
                pos = this.keys[i].value;
                break;
            }
        }
        if (pos >= 0) {
            pos += nHalfSteps;
            if (pos < 0) {
                pos += this.MAX_HALF_STEPS;
            }
            else if (pos > this.MAX_HALF_STEPS) {
                pos -= this.MAX_HALF_STEPS + 1;
            }
            for (let i = 0; i < this.keys.length; i++) {
                if (this.keys[i].value === pos) {
                    return this.keys[i].name;
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
        const comp = this;
        if (!song) {
            return '';
        }
        let chordText = '';
        let lastChord = '';
        if (!song.match(comp.chordRegex)) {
            return `<div class="no-chords">${song}</div>`;
        }
        song.split(comp.chordRegex).forEach((part, index) => {
            if (index % 2 === 0) {
                // text
                if (lastChord) {
                    chordText += `<span data-chord="${lastChord}">${part.substring(0, 1)}</span>${part.substring(1)}`;
                    lastChord = '';
                } else {
                    chordText += part;
                }
            } else {
                // chord
                lastChord = part.replace(/[[]]/, '');
                if (nHalfSteps !== 0) {
                    lastChord = lastChord.split('/').map(chord => {
                        const chordRoot = comp.chordRoot(chord);
                        const newRoot = comp.transposeChord(chordRoot, nHalfSteps);
                        return newRoot + comp.restOfChord(chord);
                    }).join('/');
                }

                // use proper symbols
                lastChord = lastChord.replace(/b/g, '♭');
                lastChord = lastChord.replace(/#/g, '♯');
            }
        });
        return `<div class="with-chords">${chordText}</div>`;
    }
}
