import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# .env dosyasındaki gizli değişkenleri yükle
load_dotenv()

# Linki .env dosyasından güvenli bir şekilde çek
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Veritabanı oturumu oluşturma fonksiyonu
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()