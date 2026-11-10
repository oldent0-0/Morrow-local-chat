const skills = [
  {
    id: "code-review",
    name: "Code Review",
    category: "Development",
    description: "Review changes for correctness, regressions, and maintainability.",
    instructions: "For code reviews, prioritize actionable bugs and regressions over style. Inspect the relevant surrounding code, explain the impact of each finding, and include file and line references when available. State when you find no material issues."
  },
  {
    id: "debugging",
    name: "Debugging",
    category: "Development",
    description: "Trace symptoms to likely root causes and suggest focused checks.",
    instructions: "For debugging, first restate the observed symptom and distinguish facts from hypotheses. Trace the relevant execution path, identify the most likely root cause, and suggest the smallest useful test or change. Do not claim a fix is verified unless it was actually tested."
  },
  {
    id: "test-planning",
    name: "Test Writing",
    category: "Development",
    description: "Design focused tests for behavior, edge cases, and regressions.",
    instructions: "When helping with tests, identify the behavior contract first. Cover the normal path, meaningful edge cases, and likely regressions using the project's existing test conventions. Prefer focused deterministic tests; do not mock away the behavior under test."
  },
  {
    id: "technical-writing",
    name: "Technical Writing",
    category: "Writing",
    description: "Write clear documentation, guides, and technical explanations.",
    instructions: "For technical writing, lead with the reader's goal, use plain language, and organize procedures into steps only when useful. Keep terminology consistent with the project, distinguish prerequisites from steps, and avoid documenting behavior that has not been confirmed."
  },
  {
    id: "explain-code",
    name: "Explain Code",
    category: "Development",
    description: "Explain code flow, key decisions, and trade-offs in approachable terms.",
    instructions: "When explaining code, start with what it does in the context of the application, then follow the important data or control flow. Explain unfamiliar terms briefly and mention relevant trade-offs. Do not imply you executed code when you only inspected it."
  },
  {
    id: "git-assistant",
    name: "Git Assistant",
    category: "Development",
    description: "Help with Git workflows and concise, informative commit messages.",
    instructions: "For Git help, explain the effect and risk of commands before recommending them, especially commands that rewrite history or discard changes. Preserve unrelated work. For commit messages, summarize the user's actual changes with a concise imperative subject and useful body when needed."
  },
  {
    id: "sql-helper",
    name: "SQL Helper",
    category: "Data",
    description: "Create readable queries and reason about data operations safely.",
    instructions: "For SQL help, clarify the intended result, use explicit columns, and make joins and filters easy to inspect. Prefer parameterized queries for application input. Before destructive data changes, recommend a preview query or transaction and explain the affected rows."
  },
  {
    id: "data-analysis",
    name: "Data Analysis",
    category: "Data",
    description: "Summarize data carefully and call out assumptions and uncertainty.",
    instructions: "For data analysis, inspect the available fields and quality before drawing conclusions. State assumptions, distinguish observations from interpretations, and use appropriate comparisons. Do not invent missing values or claim statistical significance without suitable evidence."
  },
  {
    id: "brainstorming",
    name: "Brainstorming",
    category: "Planning",
    description: "Generate varied ideas, then help narrow them to practical next steps.",
    instructions: "For brainstorming, offer several meaningfully different options rather than minor variations. Briefly explain each option's value and trade-offs, then recommend a practical next step when the user is ready. Keep early ideation open-minded and nonjudgmental."
  },
  {
    id: "meeting-notes",
    name: "Meeting Notes",
    category: "Productivity",
    description: "Turn rough notes into decisions, action items, and open questions.",
    instructions: "When organizing meeting notes, separate decisions, action items, and open questions. Preserve owners and dates only when they were provided; mark missing details as unspecified rather than guessing. Keep the summary concise and faithful to the source."
  }
];

module.exports = { skills };
