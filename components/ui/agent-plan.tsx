"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Circle,
  CircleAlert,
  CircleDotDashed,
  CircleX,
} from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Subtask {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  tools?: string[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  level: number;
  dependencies: string[];
  subtasks: Subtask[];
}

// ---------------------------------------------------------------------------
// Animation variants — padrão de animação Sirius
// Reutilize estes variants em outros componentes do projeto
// ---------------------------------------------------------------------------

export const siriusAnimations = {
  // Easing suave estilo Apple
  ease: [0.2, 0.65, 0.3, 0.9] as [number, number, number, number],
  // Easing com bounce (para badges e ícones)
  easeBounce: [0.34, 1.56, 0.64, 1] as [number, number, number, number],

  // Fade + slide vertical (listas, cards)
  fadeSlideY: {
    hidden: { opacity: 0, y: -5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 500, damping: 30 },
    },
    exit: { opacity: 0, y: -5, transition: { duration: 0.15 } },
  },

  // Expansão de altura (acordeão, dropdowns)
  heightExpand: {
    hidden: { opacity: 0, height: 0, overflow: "hidden" },
    visible: {
      height: "auto",
      opacity: 1,
      overflow: "visible",
      transition: {
        duration: 0.25,
        staggerChildren: 0.05,
        when: "beforeChildren",
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
    exit: {
      height: 0,
      opacity: 0,
      overflow: "hidden",
      transition: { duration: 0.2, ease: [0.2, 0.65, 0.3, 0.9] },
    },
  },

  // Fade + slide horizontal (itens de lista aninhados)
  fadeSlideX: {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 500, damping: 25 },
    },
    exit: { opacity: 0, x: -10, transition: { duration: 0.15 } },
  },

  // Troca de ícone com rotate (status icons)
  iconSwap: {
    initial: { opacity: 0, scale: 0.8, rotate: -10 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
    exit: { opacity: 0, scale: 0.8, rotate: 10 },
    transition: { duration: 0.2, ease: [0.2, 0.65, 0.3, 0.9] },
  },

  // Bounce para badges de status
  statusBadge: {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.08, 1],
      transition: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] },
    },
  },

  // Entrada inicial de containers/cards
  cardEntrance: {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: [0.2, 0.65, 0.3, 0.9] },
    },
  },
};

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Research Project Requirements",
    description: "Gather all necessary information about project scope and requirements",
    status: "in-progress",
    priority: "high",
    level: 0,
    dependencies: [],
    subtasks: [
      {
        id: "1.1",
        title: "Interview stakeholders",
        description: "Conduct interviews with key stakeholders to understand needs",
        status: "completed",
        priority: "high",
        tools: ["communication-agent", "meeting-scheduler"],
      },
      {
        id: "1.2",
        title: "Review existing documentation",
        description: "Go through all available documentation and extract requirements",
        status: "in-progress",
        priority: "medium",
        tools: ["file-system", "browser"],
      },
      {
        id: "1.3",
        title: "Compile findings report",
        description: "Create a comprehensive report of all gathered information",
        status: "need-help",
        priority: "medium",
        tools: ["file-system", "markdown-processor"],
      },
    ],
  },
  {
    id: "2",
    title: "Design System Architecture",
    description: "Create the overall system architecture based on requirements",
    status: "in-progress",
    priority: "high",
    level: 0,
    dependencies: [],
    subtasks: [
      {
        id: "2.1",
        title: "Define component structure",
        description: "Map out all required components and their interactions",
        status: "pending",
        priority: "high",
        tools: ["architecture-planner", "diagramming-tool"],
      },
      {
        id: "2.2",
        title: "Create data flow diagrams",
        description: "Design diagrams showing how data will flow through the system",
        status: "pending",
        priority: "medium",
        tools: ["diagramming-tool", "file-system"],
      },
    ],
  },
  {
    id: "3",
    title: "Implementation Planning",
    description: "Create a detailed plan for implementing the system",
    status: "pending",
    priority: "medium",
    level: 1,
    dependencies: ["1", "2"],
    subtasks: [
      {
        id: "3.1",
        title: "Resource allocation",
        description: "Determine required resources and allocate them to tasks",
        status: "pending",
        priority: "medium",
        tools: ["project-manager", "resource-calculator"],
      },
      {
        id: "3.2",
        title: "Timeline development",
        description: "Create a timeline with milestones and deadlines",
        status: "pending",
        priority: "high",
        tools: ["timeline-generator"],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Status icon helper
// ---------------------------------------------------------------------------

function StatusIcon({ status, size = "md" }: { status: string; size?: "sm" | "md" }) {
  const cls = size === "sm" ? "h-3.5 w-3.5" : "h-4.5 w-4.5";
  if (status === "completed") return <CheckCircle2 className={`${cls} text-green-500`} />;
  if (status === "in-progress") return <CircleDotDashed className={`${cls} text-blue-500`} />;
  if (status === "need-help") return <CircleAlert className={`${cls} text-yellow-500`} />;
  if (status === "failed") return <CircleX className={`${cls} text-red-500`} />;
  return <Circle className={`${cls} text-muted-foreground`} />;
}

function statusBadgeClass(status: string) {
  if (status === "completed") return "bg-green-100 text-green-700";
  if (status === "in-progress") return "bg-blue-100 text-blue-700";
  if (status === "need-help") return "bg-yellow-100 text-yellow-700";
  if (status === "failed") return "bg-red-100 text-red-700";
  return "bg-muted text-muted-foreground";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AgentPlan() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [expandedTasks, setExpandedTasks] = useState<string[]>(["1"]);
  const [expandedSubtasks, setExpandedSubtasks] = useState<Record<string, boolean>>({});

  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const toggleSubtaskExpansion = (taskId: string, subtaskId: string) => {
    const key = `${taskId}-${subtaskId}`;
    setExpandedSubtasks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleTaskStatus = (taskId: string) => {
    const statuses = ["completed", "in-progress", "pending", "need-help", "failed"];
    const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
              subtasks: task.subtasks.map((s) => ({
                ...s,
                status: newStatus === "completed" ? "completed" : s.status,
              })),
            }
          : task
      )
    );
  };

  const toggleSubtaskStatus = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;
        const updatedSubtasks = task.subtasks.map((s) =>
          s.id === subtaskId
            ? { ...s, status: s.status === "completed" ? "pending" : "completed" }
            : s
        );
        const allDone = updatedSubtasks.every((s) => s.status === "completed");
        return { ...task, subtasks: updatedSubtasks, status: allDone ? "completed" : task.status };
      })
    );
  };

  // Respects reduced motion preference
  const rm = prefersReducedMotion;
  const taskVariants = {
    hidden: { opacity: 0, y: rm ? 0 : -5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: rm ? "tween" : "spring", stiffness: 500, damping: 30, duration: rm ? 0.2 : undefined },
    },
    exit: { opacity: 0, y: rm ? 0 : -5, transition: { duration: 0.15 } },
  };

  return (
    <div className="bg-background text-foreground h-full overflow-auto p-2">
      <motion.div
        className="bg-card border-border rounded-lg border shadow overflow-hidden"
        {...siriusAnimations.cardEntrance}
      >
        <LayoutGroup>
          <div className="p-4 overflow-hidden">
            <ul className="space-y-1 overflow-hidden">
              {tasks.map((task, index) => {
                const isExpanded = expandedTasks.includes(task.id);
                const isCompleted = task.status === "completed";

                return (
                  <motion.li
                    key={task.id}
                    className={index !== 0 ? "mt-1 pt-2" : ""}
                    initial="hidden"
                    animate="visible"
                    variants={taskVariants}
                  >
                    {/* Task row */}
                    <motion.div
                      className="group flex items-center px-3 py-1.5 rounded-md"
                      whileHover={{ backgroundColor: "rgba(59,91,219,0.06)", transition: { duration: 0.2 } }}
                    >
                      {/* Status icon */}
                      <motion.div
                        className="mr-2 flex-shrink-0 cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); toggleTaskStatus(task.id); }}
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={task.status}
                            initial={siriusAnimations.iconSwap.initial}
                            animate={siriusAnimations.iconSwap.animate}
                            exit={siriusAnimations.iconSwap.exit}
                            transition={siriusAnimations.iconSwap.transition}
                          >
                            <StatusIcon status={task.status} size="md" />
                          </motion.div>
                        </AnimatePresence>
                      </motion.div>

                      {/* Title + badges */}
                      <motion.div
                        className="flex min-w-0 flex-grow cursor-pointer items-center justify-between"
                        onClick={() => toggleTaskExpansion(task.id)}
                      >
                        <div className="mr-2 flex-1 truncate">
                          <span className={isCompleted ? "text-muted-foreground line-through" : ""}>
                            {task.title}
                          </span>
                        </div>

                        <div className="flex flex-shrink-0 items-center space-x-2 text-xs">
                          {task.dependencies.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {task.dependencies.map((dep, idx) => (
                                <motion.span
                                  key={idx}
                                  className="bg-secondary/40 text-secondary-foreground rounded px-1.5 py-0.5 text-[10px] font-medium shadow-sm"
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.2, delay: idx * 0.05 }}
                                  whileHover={{ y: -1, transition: { duration: 0.2 } }}
                                >
                                  {dep}
                                </motion.span>
                              ))}
                            </div>
                          )}

                          <motion.span
                            className={`rounded px-1.5 py-0.5 ${statusBadgeClass(task.status)}`}
                            variants={siriusAnimations.statusBadge}
                            initial="initial"
                            animate="animate"
                            key={task.status}
                          >
                            {task.status}
                          </motion.span>
                        </div>
                      </motion.div>
                    </motion.div>

                    {/* Subtasks */}
                    <AnimatePresence mode="wait">
                      {isExpanded && task.subtasks.length > 0 && (
                        <motion.div
                          className="relative overflow-hidden"
                          variants={siriusAnimations.heightExpand}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          layout
                        >
                          <div className="absolute top-0 bottom-0 left-[20px] border-l-2 border-dashed border-muted-foreground/30" />
                          <ul className="border-muted mt-1 mr-2 mb-1.5 ml-3 space-y-0.5">
                            {task.subtasks.map((subtask) => {
                              const key = `${task.id}-${subtask.id}`;
                              const isSubExpanded = expandedSubtasks[key];

                              return (
                                <motion.li
                                  key={subtask.id}
                                  className="group flex flex-col py-0.5 pl-6"
                                  onClick={() => toggleSubtaskExpansion(task.id, subtask.id)}
                                  variants={siriusAnimations.fadeSlideX}
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  layout
                                >
                                  <motion.div
                                    className="flex flex-1 items-center rounded-md p-1"
                                    whileHover={{ backgroundColor: "rgba(59,91,219,0.06)", transition: { duration: 0.2 } }}
                                    layout
                                  >
                                    <motion.div
                                      className="mr-2 flex-shrink-0 cursor-pointer"
                                      onClick={(e) => { e.stopPropagation(); toggleSubtaskStatus(task.id, subtask.id); }}
                                      whileTap={{ scale: 0.9 }}
                                      whileHover={{ scale: 1.1 }}
                                      layout
                                    >
                                      <AnimatePresence mode="wait">
                                        <motion.div
                                          key={subtask.status}
                                          initial={siriusAnimations.iconSwap.initial}
                                          animate={siriusAnimations.iconSwap.animate}
                                          exit={siriusAnimations.iconSwap.exit}
                                          transition={siriusAnimations.iconSwap.transition}
                                        >
                                          <StatusIcon status={subtask.status} size="sm" />
                                        </motion.div>
                                      </AnimatePresence>
                                    </motion.div>

                                    <span
                                      className={`cursor-pointer text-sm ${
                                        subtask.status === "completed"
                                          ? "text-muted-foreground line-through"
                                          : ""
                                      }`}
                                    >
                                      {subtask.title}
                                    </span>
                                  </motion.div>

                                  <AnimatePresence mode="wait">
                                    {isSubExpanded && (
                                      <motion.div
                                        className="text-muted-foreground border-foreground/20 mt-1 ml-1.5 border-l border-dashed pl-5 text-xs overflow-hidden"
                                        variants={{
                                          hidden: { opacity: 0, height: 0, overflow: "hidden" },
                                          visible: {
                                            opacity: 1,
                                            height: "auto",
                                            overflow: "visible",
                                            transition: { duration: 0.25, ease: [0.2, 0.65, 0.3, 0.9] },
                                          },
                                        }}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        layout
                                      >
                                        <p className="py-1">{subtask.description}</p>
                                        {subtask.tools && subtask.tools.length > 0 && (
                                          <div className="mt-0.5 mb-1 flex flex-wrap items-center gap-1.5">
                                            <span className="text-muted-foreground font-medium">
                                              Tools:
                                            </span>
                                            <div className="flex flex-wrap gap-1">
                                              {subtask.tools.map((tool, idx) => (
                                                <motion.span
                                                  key={idx}
                                                  className="bg-secondary/40 text-secondary-foreground rounded px-1.5 py-0.5 text-[10px] font-medium shadow-sm"
                                                  initial={{ opacity: 0, y: -5 }}
                                                  animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                    transition: { duration: 0.2, delay: idx * 0.05 },
                                                  }}
                                                  whileHover={{ y: -1, transition: { duration: 0.2 } }}
                                                >
                                                  {tool}
                                                </motion.span>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </motion.li>
                              );
                            })}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </LayoutGroup>
      </motion.div>
    </div>
  );
}
