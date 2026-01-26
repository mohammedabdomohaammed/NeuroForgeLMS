# aiservice/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import sys
import io
import traceback

# Initialize App
app = FastAPI()

# Enable CORS (So React can talk to this)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data Models ---

# 1. Models for Code Execution
class TestCase(BaseModel):
    input: str
    output: str

class CodeSubmission(BaseModel):
    code: str
    test_cases: list[TestCase]

# 2. Models for AI Interview
class ChatMessage(BaseModel):
    role: str
    content: str

class InterviewRequest(BaseModel):
    message: str
    history: List[ChatMessage]


# --- Routes ---

@app.get("/")
def read_root():
    return {"status": "NeuroForge AI Service is Online 🧠"}

@app.post("/execute")
def execute_code(submission: CodeSubmission):
    results = []
    all_passed = True
    
    # 1. Define the safe context for execution
    allowed_globals = {"__builtins__": __builtins__}
    
    for i, case in enumerate(submission.test_cases):
        # Capture stdout to see if user printed anything for debugging
        old_stdout = sys.stdout
        redirected_output = io.StringIO()
        sys.stdout = redirected_output
        
        try:
            # 2. Prepare the execution script
            # Detect function name (assuming simple "def name(...):")
            func_name = submission.code.split('def ')[1].split('(')[0]
            
            # Helper script to run the specific test case
            run_script = f"""
{submission.code}

# Test Case Execution
input_val = {case.input}
result = {func_name}(input_val)
"""
            # 3. Execute!
            local_scope = {}
            exec(run_script, allowed_globals, local_scope)
            
            # 4. Get Result
            user_result = local_scope.get('result')
            
            # Convert results to string for comparison
            user_result_str = str(user_result).replace(" ", "")
            expected_str = case.output.replace(" ", "")
            
            passed = user_result_str == expected_str
            if not passed:
                all_passed = False
                
            results.append({
                "case": i + 1,
                "passed": passed,
                "input": case.input,
                "expected": case.output,
                "actual": str(user_result),
                "log": redirected_output.getvalue()
            })
            
        except Exception as e:
            all_passed = False
            results.append({
                "case": i + 1,
                "passed": False,
                "error": str(e),
                "traceback": traceback.format_exc()
            })
            
        finally:
            # Restore stdout so the server logs still work
            sys.stdout = old_stdout

    # Format the final output for the frontend console
    console_output = "Execution Results:\n"
    console_output += "=" * 20 + "\n"
    for res in results:
        status = "✅ PASS" if res['passed'] else "❌ FAIL"
        console_output += f"Test Case {res['case']}: {status}\n"
        if not res['passed']:
            if 'error' in res:
                console_output += f"   Error: {res['error']}\n"
            else:
                console_output += f"   Expected: {res['expected']}\n"
                console_output += f"   Got:      {res['actual']}\n"
    
    if all_passed:
        console_output += "\n🎉 ALL TEST CASES PASSED!"
    else:
        console_output += "\n⚠️ SOME TESTS FAILED. KEEP TRYING!"

    return {
        "passed": all_passed,
        "results": console_output
    }

@app.post("/interview")
def interview_chat(request: InterviewRequest):
    user_msg = request.message.lower()
    
    # 🧠 "Mock LLM" Logic
    # This simulates an interviewer context awareness without needing an API Key.
    
    reply = ""
    
    if "ready" in user_msg or "start" in user_msg or "begin" in user_msg:
        reply = "Great! Let's start with a classic system design concept. Can you explain the difference between a Process and a Thread?"
    
    elif "thread" in user_msg and "process" in user_msg:
        reply = "That's a solid definition. A key follow-up: Why is context switching faster in threads compared to processes?"
    
    elif "memory" in user_msg or "shared" in user_msg or "address space" in user_msg:
        reply = "Exactly! Threads share the same memory space, making switching cheaper. Now, let's switch topics. What is the time complexity of a Binary Search?"
    
    elif "log" in user_msg or "n" in user_msg:
        reply = "Correct (O(log n)). Final question: If you had to scale a Python application to handle 10,000 concurrent requests, would you use Multithreading or AsyncIO? Explain why."
    
    elif "async" in user_msg or "io" in user_msg:
        reply = "Spot on. Python's GIL limits threads, so AsyncIO is much better for I/O bound tasks like web requests. You've passed the theoretical round! 🎉"
    
    elif "hello" in user_msg or "hi" in user_msg:
        reply = "Hello there! I am your AI Technical Interviewer. Are you ready to begin the evaluation?"

    else:
        # Generic fallback to keep conversation going
        reply = "Interesting point. Can you elaborate on how that applies to scalable distributed systems?"

    return {"reply": reply}