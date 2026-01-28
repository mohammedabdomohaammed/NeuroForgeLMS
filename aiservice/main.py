# aiservice/main.py
import os
import google.generativeai as genai
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Any
import sys
import io
import traceback
from dotenv import load_dotenv

# 1. Load Env
load_dotenv()
GENAI_KEY = os.getenv("GEMINI_API_KEY")

print("------------------------------------------------")
if not GENAI_KEY:
    print("❌ ERROR: GEMINI_API_KEY is missing!")
else:
    print(f"✅ API Key found: {GENAI_KEY[:5]}...")

# 2. AUTO-DISCOVER MODELS
active_model = None

if GENAI_KEY:
    genai.configure(api_key=GENAI_KEY)
    
    print("🔍 Scanning for available models...")
    try:
        # Get all models that support 'generateContent'
        available_models = []
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                available_models.append(m.name)
        
        print(f"📋 Found Models: {available_models}")

        # Smart Selection Logic
        preferred_order = [
            'models/gemini-1.5-flash',
            'models/gemini-1.5-pro',
            'models/gemini-pro',
            'models/gemini-1.0-pro'
        ]
        
        selected_name = None
        
        # Try to find a preferred model first
        for pref in preferred_order:
            if pref in available_models:
                selected_name = pref
                break
        
        # Fallback: Just take the first one available
        if not selected_name and available_models:
            selected_name = available_models[0]

        if selected_name:
            print(f"✅ Auto-Selected Model: {selected_name}")
            # Note: We strip 'models/' prefix for the GenerativeModel constructor sometimes, 
            # but usually it handles both. We'll pass the full name just in case.
            model = genai.GenerativeModel(selected_name)
            active_model = model
        else:
            print("❌ CRITICAL: No text generation models found for this API Key.")
            
    except Exception as e:
        print(f"⚠️ Model Discovery Failed: {e}")

print("------------------------------------------------")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ... (Keep existing Pydantic Models) ...
class TestCase(BaseModel):
    input: str
    output: str

class CodeExecutionRequest(BaseModel):
    code: str
    test_cases: List[TestCase]
    mode: str = "submit"

class ChatMessage(BaseModel):
    role: str
    content: str

class InterviewRequest(BaseModel):
    message: str
    history: List[ChatMessage]

@app.get("/")
def read_root():
    return {"status": "PyForge AI Brain is Online 🧠"}

@app.post("/execute")
def execute_code(request: CodeExecutionRequest):
    # (Existing Logic - Unchanged)
    results = []
    all_passed = True
    overall_logs = ""
    allowed_globals = {"__builtins__": __builtins__}
    
    func_name = None
    try:
        if "def " not in request.code:
            raise ValueError("No function definition found. Please keep the 'def solution(...):' line.")
        func_name = request.code.split('def ')[1].split('(')[0]
    except Exception as e:
        return {"status": "error", "logs": f"Syntax Error: {str(e)}", "results": [{"case": 0, "passed": False, "error": str(e)}]}

    for i, case in enumerate(request.test_cases):
        old_stdout = sys.stdout
        redirected_output = io.StringIO()
        sys.stdout = redirected_output
        try:
            run_script = f"{request.code}\ntry:\n    input_val = {case.input}\n    result = {func_name}(input_val)\nexcept Exception as e:\n    raise e"
            local_scope = {}
            exec(run_script, allowed_globals, local_scope)
            user_result = local_scope.get('result')
            user_result_str = str(user_result).replace(" ", "")
            expected_str = case.output.replace(" ", "")
            passed = user_result_str == expected_str
            if not passed: all_passed = False
            logs = redirected_output.getvalue()
            if logs: overall_logs += f"--- Case {i+1} Output ---\n{logs}\n"
            results.append({"case": i + 1, "passed": passed, "input": case.input, "expected": case.output, "actual": str(user_result), "log": logs})
        except Exception as e:
            all_passed = False
            results.append({"case": i + 1, "passed": False, "error": str(e), "traceback": traceback.format_exc()})
        finally:
            sys.stdout = old_stdout

    if request.mode == "run":
        return {"status": "executed", "logs": overall_logs if overall_logs else "No print output.", "results": results}
    else:
        console_output = "Execution Results:\n" + "="*20 + "\n"
        for res in results:
            status = "✅ PASS" if res['passed'] else "❌ FAIL"
            console_output += f"Test Case {res['case']}: {status}\n"
            if not res['passed']:
                if 'error' in res: console_output += f"   Error: {res['error']}\n"
                else: console_output += f"   Expected: {res['expected']}\n   Got:      {res['actual']}\n"
        return {"passed": all_passed, "results": console_output + ("\n🎉 ALL TEST CASES PASSED!" if all_passed else "\n⚠️ SOME TESTS FAILED.")}

@app.post("/interview")
async def interview_chat(request: InterviewRequest):
    print(f"📩 Received Message: {request.message}") 
    
    if not active_model:
        return {"reply": "System Error: No valid AI model was found on startup. Please check server logs."}

    try:
        # Use the auto-selected model
        full_prompt = "You are PyForge, a helpful Python Tutor.\n\n"
        full_prompt += f"User: {request.message}\nTutor:"
        
        print(f"🤖 Sending to Gemini...") 
        response = active_model.generate_content(full_prompt)
        print(f"✅ Gemini Responded!") 
        
        return {"reply": response.text}

    except Exception as e:
        print(f"🔥 CRASH IN AI HANDLER: {e}") 
        traceback.print_exc()
        return {"reply": f"AI Error: {str(e)}"}