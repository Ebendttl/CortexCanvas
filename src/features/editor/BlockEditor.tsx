"use client";

import { useEditor, EditorContent, ReactRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { HocuspocusProvider } from "@hocuspocus/provider";
import * as Y from "yjs";
import { common, createLowlight } from "lowlight";
import tippy from "tippy.js";
import { useEffect, useState } from "react";

import { Commands } from "./extensions/Commands";
import { getSuggestionItems } from "./extensions/suggestion";
import { CommandList } from "./extensions/CommandList";
import { AIBubbleMenu } from "./components/AIBubbleMenu";
import { useCompletion } from "@ai-sdk/react";
import { cn } from "@/lib/utils";

const lowlight = createLowlight(common);

interface BlockEditorProps {
  documentId: string;
  user: {
    name: string;
    color: string;
  };
  content?: string;
  onChange?: (json: any) => void;
  editable?: boolean;
}

export function BlockEditor({ documentId, user, content, onChange, editable = true }: BlockEditorProps) {
  const [provider, setProvider] = useState<HocuspocusProvider | null>(null);

  const { complete } = useCompletion({
    api: "/api/ai/chat",
  });

  const handleAIAction = async (action: string) => {
    if (!editor) return;

    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, " ");

    if (!selectedText) return;

    let prompt = "";
    switch (action) {
      case "summarize":
        prompt = `Summarize this text: "${selectedText}"`;
        break;
      case "improve":
        prompt = `Improve the writing of this text: "${selectedText}"`;
        break;
      case "explain":
        prompt = `Explain this text simply: "${selectedText}"`;
        break;
      case "fix-grammar":
        prompt = `Fix the grammar and spelling in this text: "${selectedText}"`;
        break;
      case "rewrite":
        prompt = `Rewrite this text in a more professional tone: "${selectedText}"`;
        break;
      default:
        prompt = selectedText;
    }

    const response = await complete(prompt);
    if (response) {
      editor.chain().focus().insertContentAt({ from, to }, response).run();
    }
  };

  useEffect(() => {
    const p = new HocuspocusProvider({
      url: process.env.NEXT_PUBLIC_COLLECTION_URL || "ws://localhost:1234",
      name: documentId,
      onConnect: () => console.log("Connected to collaboration server"),
    });

    setProvider(p);

    return () => {
      p.destroy();
    };
  }, [documentId]);

  const editor = useEditor({
    editable,
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        history: false, // Collaboration handles history
      }),
      Heading.configure({ levels: [1, 2, 3] }),
      Placeholder.configure({
        placeholder: ({ node }: { node: any }) => {
          if (node.type.name === "heading") return "Heading...";
          return "Type '/' for commands...";
        },
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      CodeBlockLowlight.configure({ lowlight }),
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Collaboration.configure({
        document: provider?.document,
      }),
      CollaborationCursor.configure({
        provider,
        user: {
          name: user.name,
          color: user.color,
        },
      }),
      Commands.configure({
        suggestion: {
          items: getSuggestionItems,
          render: () => {
            let component: any;
            let popup: any;

            return {
              onStart: (props: any) => {
                component = new ReactRenderer(CommandList, {
                  props,
                  editor: props.editor,
                });

                if (!props.clientRect) return;

                popup = tippy("body", {
                  getReferenceClientRect: props.clientRect,
                  appendTo: () => document.body,
                  content: component.element,
                  showOnCreate: true,
                  interactive: true,
                  trigger: "manual",
                  placement: "bottom-start",
                });
              },

              onUpdate(props: any) {
                component.updateProps(props);
                if (!props.clientRect) return;
                popup[0].setProps({
                  getReferenceClientRect: props.clientRect,
                });
              },

              onKeyDown(props: any) {
                if (props.event.key === "Escape") {
                  popup[0].hide();
                  return true;
                }
                return component.ref?.onKeyDown(props);
              },

              onExit() {
                popup[0].destroy();
                component.destroy();
              },
            };
          },
        },
      }),
    ],
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-invert max-w-none focus:outline-none min-h-[500px]",
          "prose-headings:font-black prose-headings:text-white",
          "prose-p:text-white/80 prose-p:leading-relaxed",
          "prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10",
          "prose-ul:list-disc prose-ol:list-decimal"
        ),
      },
    },
  }, [provider]);

  if (!editor || !provider) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-pulse text-[#00f7ff] font-bold">Syncing knowledge...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {editor && <AIBubbleMenu editor={editor} onAction={handleAIAction} />}
      <EditorContent editor={editor} />
    </div>
  );
}
