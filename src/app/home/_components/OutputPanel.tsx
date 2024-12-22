import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCodeEditorState } from "@/store/useCodeEditorStore";
import {
  AlertTriangle,
  CheckCircle,
  Copy,
  Terminal,
  RefreshCw,
  Clock,
  Cpu,
  MemoryStick,
} from "lucide-react";

const OutputPanel = () => {
  const { output, error, isRunning } = useCodeEditorState();
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("output");
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [executionStats, setExecutionStats] = useState({
    time: "0.00",
    memory: "0.00"
  });

  const hasContent = error || output;

  const handleCopy = async () => {
    if (!hasContent) return;
    await navigator.clipboard.writeText(error || output || "");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  useEffect(() => {
    if (error) setActiveTab("error");
    else if (output) {
      setActiveTab("output");
      // Simulate execution statistics
      setExecutionStats({
        time: (Math.random() * 0.5).toFixed(2),
        memory: (Math.random() * 50).toFixed(2)
      });
    }
  }, [error, output]);

  const ExecutionStats = () => (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="bg-gray-900/50 p-3 rounded-lg">
        <div className="flex items-center gap-2 text-blue-400 mb-1">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">Execution Time</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-white">{executionStats.time}</span>
          <span className="text-sm text-gray-400">seconds</span>
        </div>
      </div>
      <div className="bg-gray-900/50 p-3 rounded-lg">
        <div className="flex items-center gap-2 text-purple-400 mb-1">
          <MemoryStick className="w-4 h-4" />
          <span className="text-sm font-medium">Memory Used</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-white">{executionStats.memory}</span>
          <span className="text-sm text-gray-400">MB</span>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-lg shadow-lg p-4 h-full border border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
            <Terminal className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-white">Code Output</h2>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-32 bg-gray-900 border-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {hasContent && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
          >
            {isCopied ? (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Copied</span>
              </motion.div>
            ) : (
              <motion.div className="flex items-center gap-1.5">
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </motion.div>
            )}
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-900">
          <TabsTrigger
            value="output"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white"
          >
            Output
          </TabsTrigger>
          <TabsTrigger
            value="error"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white"
          >
            Errors Caught
          </TabsTrigger>
        </TabsList>

        {output && !error && <ExecutionStats />}

        <TabsContent value="output" className="mt-0">
          <AnimatePresence mode="wait">
            {isRunning ? (
              <motion.div
                key="running"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gray-900 rounded-lg p-4 h-[calc(100vh-420px)]"
              >
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12"
                  >
                    <Cpu className="w-12 h-12 text-blue-400" />
                  </motion.div>
                  <p className="text-gray-400">Executing your code...</p>
                </div>
              </motion.div>
            ) : output ? (
              <motion.div
                key="output"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gray-900 rounded-lg p-4 h-[calc(100vh-420px)] overflow-auto font-mono text-sm"
              >
                <div className="flex items-center gap-2 text-green-400 mb-3">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Execution Successful</span>
                </div>
                <pre className="whitespace-pre-wrap text-gray-300">{output}</pre>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gray-900 rounded-lg p-4 h-[calc(100vh-420px)] overflow-auto font-mono text-sm flex flex-col items-center justify-center text-gray-400"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4"
                >
                  <RefreshCw className="w-8 h-8" />
                </motion.div>
                <p className="text-center">Run your code to see the output here</p>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="error" className="mt-0">
          <AnimatePresence mode="wait">
            {error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gray-900 rounded-lg p-4 h-[calc(100vh-420px)] overflow-auto font-mono text-sm"
              >
                <div className="flex items-start gap-3 text-red-400">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-1" />
                  <div className="space-y-1">
                    <div className="font-medium">Compilation/Runtime Error</div>
                    <pre className="whitespace-pre-wrap text-red-400/80">{error}</pre>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="no-error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gray-900 rounded-lg p-4 h-[calc(100vh-420px)] overflow-auto font-mono text-sm flex flex-col items-center justify-center text-gray-400"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4"
                >
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </motion.div>
                <p className="text-center">No compilation errors detected</p>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default OutputPanel;