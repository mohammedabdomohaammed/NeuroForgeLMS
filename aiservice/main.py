# aiservice/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Any
import sys
import io
import traceback

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---

# 1. Execution Models
class TestCase(BaseModel):
    input: str
    output: str

class CodeExecutionRequest(BaseModel):
    code: str
    test_cases: List[TestCase]
    mode: str = "submit"  # "run" or "submit"

# 2. Chat/Tutor Models
class ChatMessage(BaseModel):
    role: str
    content: str

class InterviewRequest(BaseModel):
    message: str
    history: List[ChatMessage]

# --- Routes ---

@app.get("/")
def read_root():
    return {"status": "PyForge AI Service is Online 🐍"}

@app.post("/execute")
def execute_code(request: CodeExecutionRequest):
    results = []
    all_passed = True
    overall_logs = ""
    allowed_globals = {"__builtins__": __builtins__}

    # 1. Validation: Extract function name before running tests
    func_name = None
    try:
        # Simple check: does the code have "def "?
        if "def " not in request.code:
            raise ValueError("No function definition found. Please keep the 'def solution(...):' line.")
            
        # Extract name (e.g., "def twoSum(nums):" -> "twoSum")
        func_name = request.code.split('def ')[1].split('(')[0]
        
    except Exception as e:
        # Return immediate error if syntax is invalid
        return {
            "status": "error",
            "logs": f"Syntax Error: {str(e)}",
            "results": [{
                "case": 0,
                "passed": False,
                "error": str(e)
            }]
        }

    # 2. Run Test Cases
    for i, case in enumerate(request.test_cases):
        old_stdout = sys.stdout
        redirected_output = io.StringIO()
        sys.stdout = redirected_output
        
        try:
            # Prepare Runner Script using the extracted func_name
            run_script = f"""
{request.code}
try:
    input_val = {case.input}
    result = {func_name}(input_val)
except Exception as e:
    raise e
"""
            local_scope = {}
            exec(run_script, allowed_globals, local_scope)
            
            user_result = local_scope.get('result')
            user_result_str = str(user_result).replace(" ", "")
            expected_str = case.output.replace(" ", "")
            
            passed = user_result_str == expected_str
            if not passed: all_passed = False

            logs = redirected_output.getvalue()
            if logs:
                overall_logs += f"--- Case {i+1} Output ---\n{logs}\n"

            results.append({
                "case": i + 1,
                "passed": passed,
                "input": case.input,
                "expected": case.output,
                "actual": str(user_result),
                "log": logs
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
            sys.stdout = old_stdout

    # 3. Return Response based on Mode
    if request.mode == "run":
        return {
            "status": "executed",
            "logs": overall_logs if overall_logs else "No print output.",
            "results": results 
        }
    else:
        # Formatting for "Submit" (Grading)
        console_output = "Execution Results:\n" + "="*20 + "\n"
        for res in results:
            status = "✅ PASS" if res['passed'] else "❌ FAIL"
            console_output += f"Test Case {res['case']}: {status}\n"
            if not res['passed']:
                if 'error' in res:
                    console_output += f"   Error: {res['error']}\n"
                else:
                    console_output += f"   Expected: {res['expected']}\n   Got:      {res['actual']}\n"
        
        if all_passed: console_output += "\n🎉 ALL TEST CASES PASSED!"
        else: console_output += "\n⚠️ SOME TESTS FAILED."

        return {
            "passed": all_passed,
            "results": console_output
        }

@app.post("/interview")
def interview_chat(request: InterviewRequest):
    user_msg = request.message.lower()
    
    # 🧠 "AI Python Tutor" Logic
    # We recognize keywords to give specific Python help.
    
    reply = ""
    
    if "list" in user_msg and "comprehension" in user_msg:
        reply = "List comprehensions are a concise way to create lists. \nSyntax: `[expression for item in iterable if condition]`\nExample: `squares = [x**2 for x in range(10)]`"
    
    elif "dictionary" in user_msg or "dict" in user_msg:
        reply = "Dictionaries are key-value pairs in Python. You can access values using `my_dict['key']` or safely using `my_dict.get('key')`. Do you want to know about iterating over dicts?"
    
    elif "decorator" in user_msg:
        reply = "Decorators are functions that modify the behavior of other functions. They are often used for logging, access control, or caching. They use the `@symbol` syntax."
    
    elif "gil" in user_msg:
        reply = "The Global Interpreter Lock (GIL) is a mutex that allows only one thread to hold the control of the Python interpreter. This means CPU-bound threads won't see much speedup, but I/O-bound tasks (like web requests) will!"
    
    elif "async" in user_msg or "await" in user_msg:
        reply = "Async/Await allows for non-blocking code execution. It's great for high-performance network applications. You run an async function using `asyncio.run(main())`."
    
    elif "debug" in user_msg or "error" in user_msg or "fix" in user_msg:
        reply = "I can help with debugging! Paste your code snippet here, and I'll analyze it for common Python pitfalls."
        
    elif "hello" in user_msg or "hi" in user_msg:
        reply = "Hello! I am your AI Python Tutor. Ask me anything about Python syntax, libraries (Pandas, NumPy), or debugging!"

    else:
        reply = "That's an interesting Python topic. Could you provide a code snippet or be more specific about the concept (e.g. Lists, Async, OOP) so I can help you better?"

    return {"reply": reply}