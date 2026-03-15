from app.supabase_client import get_supabase
from typing import Dict, Any, Optional
import uuid

def save_ai_report(report_data: Dict[str, Any], user_id: Optional[str] = None) -> Dict[str, Any] | None:
    supabase = get_supabase()
    if not supabase:
        return None
    
    try:
        data = {
            "query": report_data.get("query", ""),
            "summary": report_data.get("summary", ""),
            "sentiment": report_data.get("sentiment", ""),
            "portfolio_score": report_data.get("portfolio_score", 0),
            "key_insights": report_data.get("key_insights", []),
            "risks": report_data.get("risks", []),
            "recommendations": report_data.get("recommendations", []),
            "sector_exposure": report_data.get("sector_exposure", {}),
            "data_sources": report_data.get("data_sources", []),
            "user_id": user_id
        }
        res = supabase.table("ai_reports").insert(data).execute()
        return res.data[0] if res.data else None
    except Exception as e:
        import traceback
        print(f"Error saving report to Supabase: {e}")
        traceback.print_exc()
        return None
