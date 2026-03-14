import os
import google.generativeai as genai
import httpx
from supabase import create_client
from dotenv import load_dotenv
import traceback
from pathlib import Path

_ENV_PATH = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=_ENV_PATH)

def test_gemini():
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        return "ERROR: GEMINI_API_KEY missing"
    try:
        genai.configure(api_key=key)
        print("Available models:")
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f" - {m.name}")
        
        # Try a few common names
        models = ['gemini-1.5-flash', 'models/gemini-1.5-flash', 'gemini-pro', 'models/gemini-pro']
        results = []
        for m in models:
            try:
                model = genai.GenerativeModel(m)
                response = model.generate_content("Say hello", generation_config=genai.types.GenerationConfig(max_output_tokens=10))
                results.append(f"OK: Gemini ({m}): {response.text.strip()}")
                break
            except Exception as e:
                results.append(f"ERROR: Gemini ({m}) Error: {e}")
        return "\n".join(results)
    except Exception as e:
        return f"ERROR: Gemini Generic Error: {e}"

def test_supabase():
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    if not url or not key:
        return "ERROR: Supabase URL/Key missing"
    try:
        import supabase as sb
        ver = getattr(sb, "__version__", "unknown")
        client = create_client(url, key)
        return f"OK: Supabase (ver {ver}): Client initialized"
    except Exception as e:
        return f"ERROR: Supabase Error: {e}\n{traceback.format_exc()}"

if __name__ == "__main__":
    print("--- DETAILED API DIAGNOSTICS ---")
    print(test_gemini())
    print(test_supabase())
    print("--------------------------------")
