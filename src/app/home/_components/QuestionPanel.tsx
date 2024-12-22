"use client";
import React from "react";
import { motion } from "framer-motion";

const QuestionPanel = () => {
  const question = {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers, return indices of the two numbers such that they add up to a specific target.",
  };

  return (
    <div className="h-full flex items-center justify-center p-6">
      <motion.div
        className="p-6 rounded-lg shadow-md bg-gray-700 text-white max-w-xl w-full"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <h3 className="text-2xl font-bold mb-4">{question.title}</h3>
        <p
          className={`text-lg mb-4 ${
            question.difficulty === "Easy"
              ? "text-green-400"
              : question.difficulty === "Medium"
              ? "text-yellow-400"
              : "text-red-400"
          }`}
        >
          Difficulty: {question.difficulty}
        </p>
        <p className="text-base">{question.description}</p>
      </motion.div>
    </div>
  );
};

export default QuestionPanel;
