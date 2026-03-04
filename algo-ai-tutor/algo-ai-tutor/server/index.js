// Node 18+ required (uses built-in fetch)

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5050;


const OWNER = process.env.DSA_OWNER || "celalalyaprak";
const REPO = process.env.DSA_REPO || "data-structures-algorithms-playground";
const BRANCH = process.env.DSA_BRANCH || "main";

function rawUrl(path) {
  return `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${path}`;
}

async function fetchFile(path) {
  const res = await fetch(rawUrl(path));
  if (!res.ok) return "";
  return await res.text();
}

async function getRepoText() {
  const files = [
    "README.md",
    "milestone-1/README.md",
    "final-project/README.md",
    "milestone-1/ms2-analysis.md",
    "milestone-1/prompts.md",
    "final-project/prompts.md"
  ];

  let text = "";
  for (const f of files) {
    const data = await fetchFile(f);
    if (data) text += `\n\n---\n\n# FILE: ${f}\n\n` + data;
  }
  return text;
}

function buildExplainFromRepo(repoText, topic) {

  const t = (topic || "").toLowerCase();
  const lines = repoText.split("\n");

  const hits = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].toLowerCase().includes(t)) {
      hits.push(i);
    }
  }

  if (hits.length === 0) {
    return `Topic: ${topic}

Definition
No direct matches found in repository documentation.

Try exploring the implementation files in the repository.

Repo:
https://github.com/${OWNER}/${REPO}`;
  }

  const start = Math.max(0, hits[0] - 5);
  const end = Math.min(lines.length, hits[0] + 15);

  const snippet = lines.slice(start, end).join("\n");

  return `Topic: ${topic}

1️⃣ Definition
${topic} is a common data structure or algorithm used in computer science.

2️⃣ When to use
- When solving algorithm problems
- When optimizing search or organization of data

3️⃣ Big-O (typical)
Time Complexity: Depends on implementation  
Space Complexity: Depends on implementation

4️⃣ Example use case
Used in algorithm challenges, search systems, or data organization.

5️⃣ Common pitfalls
- Not understanding time complexity
- Implementing inefficient operations

📚 Repo context snippet:

${snippet}

🔗 Repository:
https://github.com/${OWNER}/${REPO}
`;
}
function estimateComplexityFromPython(code) {
  const lines = code.split("\n");

  let maxLoopDepth = 0;
  const indentStack = []; // { indent, isLoop }

  let hasRecursion = false;
  let functionName = null;

  for (const l of lines) {
    const m = l.match(/^\s*def\s+([a-zA-Z_]\w*)\s*\(/);
    if (m) { functionName = m[1]; break; }
  }

  for (const raw of lines) {
    const line = raw.replace(/\t/g, "    ");
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const indent = line.match(/^\s*/)[0].length;


    while (indentStack.length && indentStack[indentStack.length - 1].indent >= indent) {
      indentStack.pop();
    }

    const isLoop = /^\s*(for|while)\s+/.test(line);
    if (isLoop) {
      indentStack.push({ indent, isLoop: true });
      const depth = indentStack.filter(x => x.isLoop).length;
      if (depth > maxLoopDepth) maxLoopDepth = depth;
    } else {
      indentStack.push({ indent, isLoop: false });
    }

    if (functionName) {
      const rec = new RegExp(`\\b${functionName}\\s*\\(`);
      if (rec.test(trimmed) && !trimmed.startsWith("def ")) hasRecursion = true;
    }
  }

  let time = "Unknown";
  let notes = [];

  if (hasRecursion) {
    notes.push("Recursion detected (function calls itself).");

    if (maxLoopDepth >= 1) {
      time = `O(n^${maxLoopDepth}) * recursion`;
    } else {
      time = "O(recursive)";
    }
  } else if (maxLoopDepth === 0) {
    time = "O(1) / O(n) (no loops detected)";
    notes.push("No for/while loops detected in the scanned file.");
  } else if (maxLoopDepth === 1) {
    time = "O(n)";
    notes.push("Single loop detected.");
  } else if (maxLoopDepth === 2) {
    time = "O(n²)";
    notes.push("Nested loops detected (depth 2).");
  } else {
    time = `O(n^${maxLoopDepth})`;
    notes.push(`Nested loops detected (depth ${maxLoopDepth}).`);
  }

  
  if (/\b(sorted\s*\(|\.sort\s*\()/.test(code)) {
    notes.push("Built-in sort detected (typically O(n log n)).");
  }

  return { time, maxLoopDepth, hasRecursion, notes };
}

async function fetchGitHubJson(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "algo-ai-tutor" }
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return await res.json();
}


async function listPythonFiles() {
  const base = `https://api.github.com/repos/${OWNER}/${REPO}/contents`;
  const pathsToScan = ["milestone-1", "final-project"];

  const pyFiles = [];

  for (const p of pathsToScan) {
    try {
      const items = await fetchGitHubJson(`${base}/${p}?ref=${BRANCH}`);
      for (const it of items) {
        if (it.type === "file" && it.name.endsWith(".py")) {
          pyFiles.push(`${p}/${it.name}`);
        }
      }
    } catch {
      
    }
  }

  return pyFiles;
}
app.get("/api/topics", (req, res) => {
  res.json({ topics: ["Trie", "Hash Table", "Sorting", "Graph", "Recursion", "BST / AVL"] });
});

app.post("/api/explain", async (req, res) => {
  try {
    const { topic } = req.body;
    const repoText = await getRepoText();
    const answer = buildExplainFromRepo(repoText, topic);
    res.json({ topic, answer });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
});


app.post("/api/quiz", async (req, res) => {
  try {
    const { topic, level = "junior" } = req.body;

    const quiz = `Topic: ${topic} (Level: ${level})

1) What is ${topic} used for?
2) What is the typical time complexity (high-level)?
3) What is one real-world use case?
4) What is a common pitfall or mistake?
5) How would you test your implementation?

(Answer key suggestion: Use the repo docs + your implementation files to justify answers.)`;

    res.json({ topic, level, quiz });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
});

app.get("/api/files", async (req, res) => {
  try {
    const files = await listPythonFiles();
    res.json({ files });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
});

app.post("/api/complexity", async (req, res) => {
  try {
    const { filePath } = req.body;
    if (!filePath) return res.status(400).json({ error: "filePath is required" });

    const code = await fetchFile(filePath);
    if (!code) return res.status(404).json({ error: "File not found in repo (raw fetch failed)" });

    const result = estimateComplexityFromPython(code);

    res.json({
      filePath,
      estimatedTime: result.time,
      signals: {
        maxLoopDepth: result.maxLoopDepth,
        recursion: result.hasRecursion
      },
      notes: result.notes
    });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Using DSA repo: ${OWNER}/${REPO} (${BRANCH})`);
});