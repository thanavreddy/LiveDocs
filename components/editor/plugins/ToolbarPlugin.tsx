import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';

const LowPriority = 1;

function Divider() {
  return <div className="divider" />;
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const activeBlock = useActiveBlock();

  const updateToolbar = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        setIsBold(selection.hasFormat('bold'));
        setIsItalic(selection.hasFormat('italic'));
        setIsUnderline(selection.hasFormat('underline'));
        setIsStrikethrough(selection.hasFormat('strikethrough'));
      }
    });
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(updateToolbar);
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          editor.getEditorState().read(updateToolbar);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      )
    );
  }, [editor, updateToolbar]);

  function toggleBlock(type: 'h1' | 'h2' | 'h3' | 'quote') {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      if (activeBlock === type) {
        $setBlocksType(selection, () => $createParagraphNode());
      } else {
        const nodeMap = {
          h1: () => $createHeadingNode('h1'),
          h2: () => $createHeadingNode('h2'),
          h3: () => $createHeadingNode('h3'),
          quote: () => $createQuoteNode(),
        };
        $setBlocksType(selection, nodeMap[type]);
      }
    });
  }

  return (
    <div className="toolbar" ref={toolbarRef}>
      <button disabled={!canUndo} onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)} className="toolbar-item spaced" aria-label="Undo">
        <i className="format undo" />
      </button>
      <button disabled={!canRedo} onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)} className="toolbar-item" aria-label="Redo">
        <i className="format redo" />
      </button>
      <Divider />
      {['h1', 'h2', 'h3'].map((type) => (
        <button
          key={type}
          onClick={() => toggleBlock(type as 'h1' | 'h2' | 'h3')}
          data-active={activeBlock === type ? '' : undefined}
          className={`toolbar-item spaced ${activeBlock === type ? 'active' : ''}`}
        >
          <i className={`format ${type}`} />
        </button>
      ))}
      <Divider />
      {['bold', 'italic', 'underline', 'strikethrough'].map((format) => (
        <button
          key={format}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, format)}
          className={`toolbar-item spaced ${eval(`is${format.charAt(0).toUpperCase() + format.slice(1)}`) ? 'active' : ''}`}
          aria-label={`Format ${format.charAt(0).toUpperCase() + format.slice(1)}`}
        >
          <i className={`format ${format}`} />
        </button>
      ))}
      <Divider />
      {['left', 'center', 'right', 'justify'].map((align) => (
        <button
          key={align}
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, align)}
          className="toolbar-item spaced"
          aria-label={`${align.charAt(0).toUpperCase() + align.slice(1)} Align`}
        >
          <i className={`format ${align}-align`} />
        </button>
      ))}
    </div>
  );
}

// ✅ Fully Safe `useActiveBlock` Hook
function useActiveBlock() {
  const [editor] = useLexicalComposerContext();

  const subscribe = useCallback((onStoreChange: () => void) => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(onStoreChange);
    });
  }, [editor]);

  const getSnapshot = useCallback(() => {
    return editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return null;

      const anchor = selection.anchor.getNode();
      let element = anchor.getKey() === 'root' ? anchor : anchor.getTopLevelElementOrThrow();

      return $isHeadingNode(element) ? element.getTag() : element.getType();
    });
  }, [editor]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
