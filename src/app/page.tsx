import CodeEditor from "@/components/ui/code-editor";
import Image from "next/image";

export default function Home() {
  return (
<>
<CodeEditor room="soemthign" theme="vs-dark" defaultLanguage="javascript" url="ws://localhost:1234" key={""}/>
</>
  );
}
