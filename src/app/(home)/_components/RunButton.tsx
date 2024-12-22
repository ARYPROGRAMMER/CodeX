import React from 'react';
import { Loader2, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMutation } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import { api } from '../../../../convex/_generated/api';
import {
  getExecutionResult,
  useCodeEditorState,
} from '@/store/useCodeEditorStore';

interface RunButtonProps {
  onStatusChange: (status: 'idle' | 'running' | 'success' | 'error') => void;
}

const RunButton: React.FC<RunButtonProps> = ({ onStatusChange }) => {
  const { user } = useUser();
  const { runCode, language, isRunning } = useCodeEditorState();
  const saveCodeExecution = useMutation(api.codeExecutions.saveCodeExecution);

  const handleRun = async () => {
    try {
      onStatusChange('running');
      await runCode();
      const result = getExecutionResult();

      if (user && result) {
        await saveCodeExecution({
          language,
          code: result.code,
          output: result.output || undefined,
          error: result.error || undefined,
        });
        onStatusChange(result.error ? 'error' : 'success');
      }
    } catch (error) {
      onStatusChange('error');
      console.error('Execution failed:', error);
    }
  };

  return (
    <motion.button
      onClick={handleRun}
      disabled={isRunning}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative inline-flex items-center gap-2.5 px-5 py-2.5 disabled:cursor-not-allowed focus:outline-none"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500 rounded-xl opacity-100 transition-opacity group-hover:opacity-90" />

      <div className="relative flex items-center gap-2.5">
        {isRunning ? (
          <>
            <div className="relative">
              <Loader2 className="w-4 h-4 animate-spin text-white/70" />
              <div className="absolute inset-0 blur animate-pulse" />
            </div>
            <span className="text-sm font-medium text-white/90">
              Executing...
            </span>
          </>
        ) : (
          <>
            <div className="relative flex items-center justify-center w-4 h-4">
              <Play className="w-4 h-4 text-white/90 transition-transform group-hover:scale-110 group-hover:text-white" />
            </div>
            <span className="text-sm font-medium text-white/90 group-hover:text-white">
              Execute Code
            </span>
          </>
        )}
      </div>
    </motion.button>
  );
};

export default RunButton;