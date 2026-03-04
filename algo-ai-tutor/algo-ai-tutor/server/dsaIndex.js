const OWNER = process.env.DSA_OWNER;
const REPO = process.env.DSA_REPO;
const BRANCH = process.env.DSA_BRANCH || "main";

function rawUrl(path) {
  return `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${path}`;
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) return null;
  return await res.text();
}

export async function buildRepoContext() {
  const files = [
    { path: "README.md", label: "Root README" },
    { path: "milestone-1/README.md", label: "Milestone-1 README" },
    { path: "final-project/README.md", label: "Final-Project README" },


    { path: "milestone-1/ms2-analysis.md", label: "Milestone-1 Analysis" },
    { path: "milestone-1/prompts.md", label: "Milestone-1 Prompts" },
    { path: "final-project/prompts.md", label: "Final-Project Prompts" }
  ];

  const chunks = [];
  const sources = [];

  for (const f of files) {
    const url = rawUrl(f.path);
    const text = await fetchText(url);
    if (text) {
      chunks.push(`## ${f.label} (${f.path})\n${text}`);
      sources.push(`https://github.com/${OWNER}/${REPO}/blob/${BRANCH}/${f.path}`);
    }
  }

  return { text: chunks.join("\n\n---\n\n"), sources };
}

export function filterContextByTopic(fullText, topic) {
  const t = (topic || "").toLowerCase();
  if (!t) return fullText.slice(0, 6000);

  const lines = fullText.split("\n");
  const hits = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].toLowerCase().includes(t)) hits.push(i);
  }

  if (hits.length === 0) return fullText.slice(0, 6000);

  const start = Math.max(0, hits[0] - 40);
  const end = Math.min(lines.length, hits[0] + 160);
  return lines.slice(start, end).join("\n").slice(0, 6000);
}


export function getTopics() {
  return ["Trie", "Hash Table", "Sorting", "Graph", "Recursion", "BST / AVL"];
}