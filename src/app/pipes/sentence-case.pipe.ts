import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sentencecase',
    standalone: false
})
export class SentenceCasePipe implements PipeTransform {
    transform(value: string): string {
      if (!value) {
        return value;
      }
      if (typeof value !== 'string') {
        throw Error(`Invalid pipe argument: '${value}' for pipe 'SentenceCasePipe'`);
      }
      const sentenceEndMarker: string = '. '
      return value.split(sentenceEndMarker).map(
        (sentence) => sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase()
      ).join(sentenceEndMarker);
    }
}
