# ai-algorithm-tutor

AI-powered learning tool that explains data structures and algorithms by analyzing my own GitHub implementation repository.

This project connects to my **Data Structures & Algorithms Playground** repository and generates structured explanations, quizzes, and complexity estimates based on the source code.

---

# Features

- Algorithm explanations (Trie, Hash Tables, Graphs, Recursion)
- Interview-style quiz generator
- Code complexity analyzer
- Repository-driven explanations
- Interactive learning UI
- REST API backend

---

# Tech Stack

Backend  
- Node.js  
- Express.js  

Frontend  
- HTML  
- JavaScript  

Architecture  
- REST API  
- GitHub repository ingestion  
- Code analysis heuristics  

---

# Architecture
User Interface
↓
Frontend (HTML + JS)
↓
Express API
↓
Repository Context Loader
↓
Structured Explanation Generator


The tutor dynamically reads documentation from:

github.com/celalalyaprak/data-structures-algorithms-playground

---

## How to Run

```bash
npm install
npm run server

Then open:

web/public/index.html


Example Output

Topic: Trie
Definition
Trie is a tree structure used for prefix searching.
When to use
Used in autocomplete systems and dictionaries.

Big-O
Search: O(L)
Insert: O(L)

Example
Used in search engines for prefix-based suggestions.

---

# Future Improvements

- Code snippet extraction from repository
- Visualization of algorithm execution
- LLM integration for deeper explanations
- Interactive coding challenges

---

# Demo

### Algorithm Explanation
Explains algorithms with structured sections.

![Explain Demo](./screenshots/explain.png)

### Interview Quiz Generator
Generates practice questions for algorithm topics.

![Quiz Demo](./screenshots/quiz.png)

### Code Complexity Analyzer
Analyzes Python implementations and estimates time complexity.

![Analyze Demo](./screenshots/analyze.png)
