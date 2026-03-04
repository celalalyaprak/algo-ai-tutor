# AI Algorithm Tutor

AI-inspired learning tool that explains Data Structures & Algorithms by extracting context from my GitHub DSA repository, and provides:
- Structured explanations
- Interview-style quizzes
- Basic code complexity signals (nested loops + recursion)

🔗 DSA source repo: https://github.com/celalalyaprak/data-structures-algorithms-playground

---

## Features

- Algorithm explanations (Trie, Hash Table, Sorting, Graph, Recursion, BST/AVL)
- Repository-driven context extraction (reads docs from my DSA repo)
- Quiz generator for interview practice
- Code complexity analyzer (heuristics):
  - detects recursion
  - detects loop nesting depth
  - estimates Big-O signal

---

## API Endpoints

- `GET /api/topics`
- `POST /api/explain`  `{ "topic": "Trie" }`
- `POST /api/quiz`     `{ "topic": "Trie", "level": "junior" }`
- `GET /api/files`
- `POST /api/complexity` `{ "filePath": "milestone-1/project.py" }`

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

## Demo

### Explain
<img width="879" height="815" alt="explain" src="https://github.com/user-attachments/assets/f7d03aef-33f6-475c-aceb-b43b5b408421" />


### Quiz
<img src="screenshots/quiz.png" width="800" />

### Analyze
<img src="screenshots/analyze.png" width="800" />



### Code Complexity Analyzer
Analyzes Python implementations and estimates time complexity.
