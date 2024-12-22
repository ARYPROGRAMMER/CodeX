'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import EditorPanel from "./_components/EditorPanel"
import Header from "./_components/Header"
import OutputPanel from "./_components/OutputPanel"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCodeEditorState } from '@/store/useCodeEditorStore'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const outputRef = useRef<HTMLDivElement>(null)
  const { isRunning } = useCodeEditorState()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isRunning && outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isRunning])

  if (!mounted) return null

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 to-slate-950">
      <Header />
      <main className="flex-1 overflow-hidden">
        <ResizablePanelGroup 
          direction="horizontal" 
          className="h-full rounded-lg"
        >
          {/* Problems Panel */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="h-full border-r border-slate-700 bg-slate-900/50"
            >
              <div className="p-4 border-b border-slate-700">
                <h2 className="text-xl font-semibold text-slate-200">Problems</h2>
              </div>
              <ScrollArea className="h-[calc(100vh-10rem)] px-4">
                {/* Sample problem list */}
                {Array.from({ length: 10 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className="mb-4 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer group"
                  >
                    <h3 className="text-slate-200 font-medium group-hover:text-blue-400 transition-colors">
                      Problem {i + 1}
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">Difficulty: Medium</p>
                  </motion.div>
                ))}
              </ScrollArea>
            </motion.div>
          </ResizablePanel>

          <ResizableHandle className="w-1.5 bg-slate-700 hover:bg-slate-600 transition-colors" />

          {/* Editor and Output Panel */}
          <ResizablePanel defaultSize={75}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel 
                defaultSize={65} 
                minSize={40}
                className="bg-slate-900/50 rounded-tl-lg"
              >
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="h-full p-4"
                >
                  <EditorPanel />
                </motion.div>
              </ResizablePanel>

              <ResizableHandle className="h-1.5 bg-slate-700 hover:bg-slate-600 transition-colors" />

              <ResizablePanel 
                defaultSize={35} 
                minSize={20}
                className="bg-slate-900/50 rounded-bl-lg"
              >
                <motion.div
                  ref={outputRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="h-full p-4"
                >
                  <OutputPanel />
                </motion.div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  )
}