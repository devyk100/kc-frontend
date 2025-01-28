import CodeEditor from "@/components/ui/code-editor";
import CodeEditorWrapper from "@/components/ui/code-editor-wrapper";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <CodeEditorWrapper room="soemthign" theme="vs-dark" defaultLanguage="javascript" url="ws://localhost:1234" key={""} />
      <Textarea />

    </>
  );
}
