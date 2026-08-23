import os
import datetime
import jwt
from secrets import compare_digest
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List
from dotenv import load_dotenv

import models
import schemas
import crud
from database import engine, get_db, SessionLocal

load_dotenv()

# Veritabanı tablolarını oluştur (Eğer yoksa)
models.Base.metadata.create_all(bind=engine)

ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "Koreli1907")
JWT_SECRET = os.getenv("JWT_SECRET", "d5006cc73d6b05423abdf87d559868e82ef4d0b1ab3d36b85e0de9d554a938c6")
JWT_ALGORITHM = "HS256"

security = HTTPBearer()

def verify_admin_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("sub") != "admin":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Geçersiz yetki düzeyi"
            )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Oturum süresi doldu, lütfen tekrar giriş yapın."
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Geçersiz kimlik doğrulama token'ı"
        )

app = FastAPI(title="Koreli Çeyiz API")

# --- CORS GÜVENLİK AYARLARI ---
# Yerel geliştirme ve canlı alan adları
default_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://koreli-ceyiz.vercel.app",
    "https://koreliceyiz.com",
    "https://www.koreliceyiz.com"
]

allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "")
if allowed_origins_str and allowed_origins_str.strip() != "*":
    extra_origins = [origin.strip() for origin in allowed_origins_str.split(",") if origin.strip()]
    allowed_origins = list(set(default_origins + extra_origins))
    allow_all = False
elif allowed_origins_str.strip() == "*":
    allowed_origins = ["*"]
    allow_all = True
else:
    allowed_origins = default_origins
    allow_all = False

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if not allow_all else ["*"],
    allow_origin_regex=r"^https://.*\.vercel\.app$" if not allow_all else None,
    allow_credentials=True if not allow_all else False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"mesaj": "Koreli Çeyiz Backend Sistemi Başarıyla Çalışıyor!"}

@app.post("/login/", response_model=schemas.TokenResponse)
def login(request: schemas.LoginRequest):
    if compare_digest(request.password, ADMIN_PASSWORD):
        payload = {
            "sub": "admin",
            "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
        return {"token": token}
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Hatalı şifre!"
    )

# --- KATEGORİ ENDPOINT'LERİ ---

@app.post("/categories/", response_model=schemas.Category)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db), token_data: dict = Depends(verify_admin_token)):
    return crud.create_category(db=db, category=category)

@app.get("/categories/", response_model=List[schemas.Category])
def read_categories(db: Session = Depends(get_db)):
    return crud.get_categories(db=db)

@app.delete("/categories/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db), token_data: dict = Depends(verify_admin_token)):
    # 1. Kategoriye ait ürün var mı kontrol et
    products = crud.get_products_by_category(db=db, category_id=category_id)
    if products:
        # Eğer içi doluysa silmeyi reddet ve hata mesajı fırlat
        raise HTTPException(status_code=400, detail="Bu kategoriye ait ürünler var! Önce içindeki ürünleri silin.")
    
    # 2. İçi boşsa güvenle sil
    success = crud.delete_category(db=db, category_id=category_id)
    if not success:
        raise HTTPException(status_code=404, detail="Silinecek kategori bulunamadı")
    return {"message": "Kategori başarıyla silindi"}

# --- ÜRÜN ENDPOINT'LERİ ---

@app.post("/products/", response_model=schemas.Product)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db), token_data: dict = Depends(verify_admin_token)):
    return crud.create_product(db=db, product=product)

@app.get("/products/", response_model=List[schemas.Product])
def read_products(db: Session = Depends(get_db)):
    return crud.get_products(db=db)

# YENİ EKLENEN: TEKİL ÜRÜN ÇEKME ROTASI (GET)
@app.get("/products/{product_id}", response_model=schemas.Product)
def read_product(product_id: int, db: Session = Depends(get_db)):
    db_product = crud.get_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")
    return db_product

# ÜRÜN GÜNCELLEME ROTASI (PUT)
@app.put("/products/{product_id}", response_model=schemas.Product)
def update_product(product_id: int, product: schemas.ProductCreate, db: Session = Depends(get_db), token_data: dict = Depends(verify_admin_token)):
    updated_product = crud.update_product(db=db, product_id=product_id, product=product)
    if updated_product is None:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")
    return updated_product

# ÜRÜN SİLME ROTASI (DELETE)
@app.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), token_data: dict = Depends(verify_admin_token)):
    deleted_product = crud.delete_product(db=db, product_id=product_id)
    if not deleted_product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")
    return {"message": "Ürün başarıyla silindi"}

# --- AYAR (SETTINGS) ENDPOINT'LERİ ---

@app.get("/settings/")
def read_settings(db: Session = Depends(get_db)):
    settings = crud.get_settings(db=db)
    return {s.key: s.value for s in settings}

@app.put("/settings/")
def update_settings(settings_data: dict, db: Session = Depends(get_db), token_data: dict = Depends(verify_admin_token)):
    for key, value in settings_data.items():
        crud.update_or_create_setting(db=db, key=key, value=str(value))
    return {"message": "Ayarlar başarıyla güncellendi"}

# --- SEEDING (BAŞLANGIÇ VERİLERİ) ---
def seed_settings():
    db = SessionLocal()
    try:
        if not crud.get_setting(db, "working_hours_weekdays"):
            crud.update_or_create_setting(db, "working_hours_weekdays", "09:00 - 19:30")
        if not crud.get_setting(db, "working_hours_sunday"):
            crud.update_or_create_setting(db, "working_hours_sunday", "* Pazar günleri kapalıyız.")
    finally:
        db.close()

seed_settings()