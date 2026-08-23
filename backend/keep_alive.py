import os
import sys
from datetime import datetime
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# backend dizinindeki .env dosyasını yükle
current_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(current_dir, ".env")
load_dotenv(dotenv_path=env_path)

DATABASE_URL = os.getenv("DATABASE_URL")

def ping_supabase():
    log_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    if not DATABASE_URL:
        print(f"[{log_time}] HATA: DATABASE_URL .env dosyasında bulunamadı!")
        return False

    try:
        engine = create_engine(DATABASE_URL, pool_pre_ping=True)
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1;"))
            val = result.scalar()
            if val == 1:
                print(f"[{log_time}] BASARILI: Supabase veritabanına aktiflik sinyali gönderildi (SELECT 1).")
                return True
            else:
                print(f"[{log_time}] UYARI: Beklenmeyen yanıt alındı: {val}")
                return False
    except Exception as e:
        print(f"[{log_time}] HATA: Supabase'e baglanirken sorun olustu: {e}")
        return False

if __name__ == "__main__":
    success = ping_supabase()
    sys.exit(0 if success else 1)
