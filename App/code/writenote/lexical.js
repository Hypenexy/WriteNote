/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {createEmptyHistoryState, registerHistory} from '@lexical/history';
import {HeadingNode, QuoteNode, registerRichText} from '@lexical/rich-text';
import {TextNode} from 'lexical';
import {mergeRegister} from '@lexical/utils';
import {createEditor, HISTORY_MERGE_TAG} from 'lexical';


// editor.update(prepopulatedRichText, {tag: HISTORY_MERGE_TAG});

const config = {
    nodes: [HeadingNode, QuoteNode, TextNode],
};
const editor = createEditor(config);

function run(state) {
    var writenoteNode = writenote.writenote,
        notearea = writenote.notearea,
        overlay = document.createElement("div"),
        carets = document.createElement("div");

    overlay.classList.add("overlay");
    writenoteNode.appendChild(overlay);

    carets.classList.add("carets");
    overlay.appendChild(carets);

    writenote.workspaceData.state = {};

    writenote.workspaceData.save = () => {
        return JSON.stringify(editor.getEditorState());
    }

    // const initialConfig = {
    //     namespace: 'Vanilla JS Demo',
    //     // Register nodes specific for @lexical/rich-text
    //     nodes: [HeadingNode, QuoteNode],
    //     onError: (error) => {
    //         throw error;
    //     },
    //     theme: {
    //     // Adding styling to Quote node, see styles.css
    //         quote: 'PlaygroundEditorTheme__quote',
    //     },
    // };


    // Initialize editor
    const initialEditorState = state.data;

    // Initialize notearea element
    notearea.contentEditable = true;
    editor.setRootElement(notearea);

    // Registering Plugins
    mergeRegister(
        registerRichText(editor, initialEditorState),
        registerHistory(editor, createEmptyHistoryState(), 300),
    );
    
    // Load editor state
    if (initialEditorState) {
        const parsedState = editor.parseEditorState(initialEditorState);
        editor.setEditorState(parsedState);
    }
}

window.InitializeEditor = run;

// export const InitializeEditor = (state) => {
//   run(state)
// };
