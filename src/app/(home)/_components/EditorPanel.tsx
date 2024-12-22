import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCodeEditorState } from "@/store/useCodeEditorStore";
import { defineMonacoThemes, LANGUAGE_CONFIG } from "../_constants";
import { Editor } from "@monaco-editor/react";
import { SignedIn, useClerk } from "@clerk/nextjs";
import Image from "next/image";
import { EditorPanelSkeleton } from "./EditorPanelLoading";
import useMounted from "@/hooks/useMounted";
import ShareSnippetDialog from "./ShareSnippetDialog";
import {
  RotateCcwIcon,
  ShareIcon,
  TypeIcon,
  DownloadIcon,
  UploadIcon,
  FileIcon,
  SettingsIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import RunButton from "./RunButton";

function EditorPanel() {
  const clerk = useClerk();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const { language, theme, fontSize, editor, setFontSize, setEditor } =
    useCodeEditorState();
  const mounted = useMounted();
  const [status, setStatus] = useState<
    "ready" | "running" | "passed" | "failed"
  >("ready");

  useEffect(() => {
    const savedCode = localStorage.getItem(`editor-code-${language}`);
    const newCode = savedCode || LANGUAGE_CONFIG[language].defaultCode;
    if (editor) editor.setValue(newCode);
  }, [language, editor]);

  useEffect(() => {
    const savedFontSize = localStorage.getItem("editor-font-size");
    if (savedFontSize) setFontSize(parseInt(savedFontSize));
  }, [setFontSize]);

  const handleRefresh = () => {
    const defaultCode = LANGUAGE_CONFIG[language].defaultCode;
    if (editor) editor.setValue(defaultCode);
    localStorage.removeItem(`editor-code-${language}`);
    toast({
      title: "Code Reset",
      description: "Your code has been reset to the default.",
      duration: 3000,
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value) localStorage.setItem(`editor-code-${language}`, value);
  };

  const handleFontSizeChange = (newSize: number[]) => {
    const size = Math.min(24, Math.max(12, newSize[0]));
    setFontSize(size);
    localStorage.setItem("editor-font-size", size.toString());
  };

  if (!mounted) return null;

  const statusColors = {
    ready: "bg-gray-500",
    running: "bg-yellow-500 animate-pulse",
    passed: "bg-green-500",
    failed: "bg-red-500",
  };

  const statusText = {
    ready: "Ready",
    running: "Running...",
    passed: "Passed",
    failed: "Failed",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-full gap-4"
    >
      <Card className="border-gray-700 bg-gray-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600">
                <Image
                  src={"/" + language + ".png"}
                  alt="Language Logo"
                  width={28}
                  height={28}
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Problem Solution
                </h2>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {language.toUpperCase()}
                  </Badge>
                  <Badge className={`text-xs ${statusColors[status]}`}>
                    {statusText[status]}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg">
                <TypeIcon className="w-4 h-4 text-gray-400" />
                <Slider
                  min={12}
                  max={24}
                  step={1}
                  value={[fontSize]}
                  onValueChange={handleFontSizeChange}
                  className="w-24"
                />
                <span className="text-sm font-medium text-gray-400 min-w-[2rem] text-center">
                  {fontSize}
                </span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="bg-gray-700">
                    <SettingsIcon className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-gray-800 border-gray-700"
                >
                  <DropdownMenuItem>
                    <FileIcon className="w-4 h-4 mr-2" />
                    New File
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <UploadIcon className="w-4 h-4 mr-2" />
                    Upload File
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                className="bg-gray-700"
              >
                <RotateCcwIcon className="w-4 h-4" />
              </Button>

              <Button
                onClick={() => setIsShareDialogOpen(true)}
                variant="outline"
                className="bg-gray-700"
              >
                <ShareIcon className="w-4 h-4 mr-2" />
                Share
              </Button>

              <SignedIn>
                <motion.div
                  key="run-button"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  whileHover={{ y: -2 }}
                >
                  <RunButton
                    onStatusChange={(newStatus) => {
                      switch (newStatus) {
                        case "error":
                          setStatus("failed");
                          break;
                        case "success":
                          setStatus("passed");
                          break;
                        case "running":
                          setStatus("running");
                          break;
                        default:
                          setStatus("ready");
                      }
                    }}
                  />
                </motion.div>
              </SignedIn>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="flex-1 border-gray-700 bg-gray-800 overflow-hidden">
        <Tabs defaultValue="editor" className="h-full">
          <TabsList className="bg-gray-900 border-b border-gray-700 p-0 h-10">
            <TabsTrigger
              value="editor"
              className="data-[state=active]:bg-gray-800 rounded-none border-r border-gray-700 h-full"
            >
              Code
            </TabsTrigger>
            <TabsTrigger
              value="input"
              className="data-[state=active]:bg-gray-800 rounded-none border-r border-gray-700 h-full"
            >
              Input
            </TabsTrigger>
          </TabsList>

          <div className="h-[calc(100%-2.5rem)]">
            {clerk.loaded ? (
              <Editor
                height="100%"
                language={LANGUAGE_CONFIG[language].monacoLanguage}
                theme={theme}
                onChange={handleEditorChange}
                beforeMount={defineMonacoThemes}
                onMount={(editor) => setEditor(editor)}
                options={{
                  minimap: { enabled: false },
                  fontSize: fontSize,
                  fontFamily: '"Fira Code", monospace',
                  fontLigatures: true,
                  cursorBlinking: "smooth",
                  smoothScrolling: true,
                  contextmenu: true,
                  lineNumbers: "on",
                  renderLineHighlight: "all",
                  scrollbar: {
                    verticalScrollbarSize: 8,
                    horizontalScrollbarSize: 8,
                  },
                }}
              />
            ) : (
              <EditorPanelSkeleton />
            )}
          </div>
        </Tabs>
      </Card>

      {isShareDialogOpen && (
        <ShareSnippetDialog onClose={() => setIsShareDialogOpen(false)} />
      )}
    </motion.div>
  );
}

export default EditorPanel;
