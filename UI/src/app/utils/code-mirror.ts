import * as CodeMirror from 'codemirror';
import { EditorConfiguration, EditorFromTextArea } from 'codemirror';

export function initCodeMirror(textEditor: HTMLTextAreaElement,
                               config: EditorConfiguration): EditorFromTextArea {
  return CodeMirror.fromTextArea(textEditor, config)
}
