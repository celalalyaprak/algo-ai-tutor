const fileSel = document.getElementById("file");
const topicSel = document.getElementById("topic");
const out = document.getElementById("out");

async function loadTopics() {
  out.textContent = "Loading topics...";
  const res = await fetch("http://localhost:5050/api/topics");
  const data = await res.json();

  topicSel.innerHTML = "";
  (data.topics || []).forEach((t) => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    topicSel.appendChild(opt);
  });

  out.textContent = "Select a topic and click Explain or Quiz.";
}

async function explain() {
  out.textContent = "Loading explanation...";
  const res = await fetch("http://localhost:5050/api/explain", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic: topicSel.value })
  });
  const data = await res.json();
  out.textContent = data.answer || data.error || "No response";
}

async function quiz() {
  out.textContent = "Loading quiz...";
  const res = await fetch("http://localhost:5050/api/quiz", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic: topicSel.value, level: "junior" })
  });
  const data = await res.json();
  out.textContent = data.quiz || data.error || "No response";
}

document.getElementById("btnExplain").onclick = explain;
document.getElementById("btnQuiz").onclick = quiz;

async function loadFiles() {
  const res = await fetch("http://localhost:5050/api/files");
  const data = await res.json();

  fileSel.innerHTML = "";
  (data.files || []).forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p;
    opt.textContent = p;
    fileSel.appendChild(opt);
  });
}

async function analyze() {
  out.textContent = "Analyzing complexity...";
  const res = await fetch("http://localhost:5050/api/complexity", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filePath: fileSel.value })
  });
  const data = await res.json();

  if (data.error) {
    out.textContent = data.error;
    return;
  }

  out.textContent =
`File: ${data.filePath}

Estimated time: ${data.estimatedTime}

Signals:
- maxLoopDepth: ${data.signals.maxLoopDepth}
- recursion: ${data.signals.recursion}

Notes:
- ${data.notes.join("\n- ")}`;
}


document.getElementById("btnAnalyze").onclick = analyze;

loadTopics();
loadFiles();