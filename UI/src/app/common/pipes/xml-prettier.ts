/*
	 * angular-pretty-xml
	 * https://github.com/krtnio/angular-pretty-xml
	 *
	 * Licensed under the MIT license.
	 *
	 * Adapted for CDM Builder.
	 */

import { isString } from 'src/app/infrastructure/utility';

function prettify(xml, indent) {
  if (isFinite(indent)) {
      if (indent !== 0)
          indent = indent || 2;
  } else if (!isString(indent))
      indent = 2;

  var arr = xml.replace(/>\s*</gm, '><')
      .replace(/</g, '~::~<')
      .replace(/\s*xmlns([=:])/g, '~::~xmlns$1')
      .split('~::~');

  var len = arr.length,
      inComment = false,
      depth = 0,
      string = '',
      shift = createShiftArr(indent);

  for (var i = 0; i < len; i++) {
      // start comment or <![CDATA[...]]> or <!DOCTYPE //
      if (arr[i].indexOf('<!') !== -1) {
          string += shift[depth] + arr[i];
          inComment = true;

          // end comment or <![CDATA[...]]> //
          if (arr[i].indexOf('-->') !== -1 || arr[i].indexOf(']>') !== -1 ||
              arr[i].indexOf('!DOCTYPE') !== -1) {
              inComment = false;
          }
      } else if (arr[i].indexOf('-->') !== -1 || arr[i].indexOf(']>') !== -1) { // end comment  or <![CDATA[...]]> //
          string += arr[i];
          inComment = false;
      } else if (/^<\w/.test(arr[i - 1]) && /^<\/\w/.test(arr[i]) && // <elm></elm> //
          /^<[\w:\-.,]+/.exec(arr[i - 1])[0] === /^<\/[\w:\-.,]+/.exec(arr[i])[0].replace('/', '')) {
          string += arr[i];
          if (!inComment) depth--;
      } else if (arr[i].search(/<\w/) !== -1 && arr[i].indexOf('</') === -1 && arr[i].indexOf('/>') === -1) // <elm> //
          string += !inComment ? (shift[depth++] + arr[i]) : arr[i];
      else if (arr[i].search(/<\w/) !== -1 && arr[i].indexOf('</') !== -1) // <elm>...</elm> //
          string += !inComment ? shift[depth] + arr[i] : arr[i];
      else if (arr[i].search(/<\//) > -1) // </elm> //
          string += !inComment ? shift[--depth] + arr[i] : arr[i];
      else if (arr[i].indexOf('/>') !== -1) // <elm/> //
          string += !inComment ? shift[depth] + arr[i] : arr[i];
      else if (arr[i].indexOf('<?') !== -1) // <? xml ... ?> //
          string += shift[depth] + arr[i];
      else if (arr[i].indexOf('xmlns:') !== -1 || arr[i].indexOf('xmlns=') !== -1) // xmlns //
          string += shift[depth] + arr[i];
      else
          string += arr[i];
  }

  function createShiftArr (step) {
    var space = '';
    if (isNaN(parseInt(step))) // argument is string
        space = step;
    else // argument is integer
        for (var i = 0; i < step; i++)
            space += ' ';

    var shift = ['\n']; // array of shifts

    for (var ix = 0; ix < 100; ix++)
        shift.push(shift[ix] + space);

    return shift;
}

  return string.trim();
}

export {
  prettify
}

