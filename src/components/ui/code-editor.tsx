"use client"
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';
import React, { useEffect, useMemo, useState } from 'react';
import Editor from '@monaco-editor/react';

function CodeEditor({ url, room, theme, defaultLanguage }: { url: string; room: string; theme: string; defaultLanguage: string }) {
  const ydoc = useMemo(() => new Y.Doc(), []);
  const [editor, setEditor] = useState<any | null>(null);
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const [binding, setBinding] = useState<MonacoBinding | null>(null);

  useEffect(() => {
    const provider = new WebsocketProvider(url, room, ydoc);
    setProvider(provider);

    provider.awareness.setLocalStateField('user', { name: 'User1' }); // Example user state
    return () => {
      provider?.destroy();
      ydoc.destroy();
    };
  }, [ydoc]);

  useEffect(() => {
    if (provider == null || editor == null) return;

    const binding = new MonacoBinding(ydoc.getText(), editor.getModel()!, new Set([editor]), provider?.awareness);
    setBinding(binding);

    // Track local cursor position and update awareness
    editor.onDidChangeCursorPosition(() => {
      const position = editor.getPosition();
      provider.awareness.setLocalStateField('cursor', {
        anchor: position,
      });
    });

    // Listen for awareness changes and update remote cursors
    provider.awareness.on('change', () => {
      console.log('Awareness states:', Array.from(provider.awareness.getStates()));
    });

    return () => {
      binding.destroy();
    };
  }, [ydoc, provider, editor]);

  return (
    <Editor
      height="90vh"
      defaultValue="// some comment"
      theme={theme}
      defaultLanguage={defaultLanguage}
      onMount={(editor) => {
        setEditor(editor);
      }}
    />
  );
}

export default CodeEditor;
