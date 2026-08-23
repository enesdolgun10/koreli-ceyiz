from pydantic import BaseModel
from typing import Optional, List

# KATEGORİ ŞEMALARI
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None # Koleksiyon özel açıklaması
    image_url: Optional[str] = None   # İsteğe bağlı görsel linki

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int

    class Config:
        from_attributes = True # (Eski pydantic sürümlerindeki orm_mode = True'nun güncel halidir)

# ÜRÜN ŞEMALARI
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    old_price: Optional[float] = None
    image_url: Optional[str] = None
    gallery_urls: Optional[List[str]] = [] # Fotoğraf linkleri listesi
    stock_quantity: Optional[int] = 10
    is_active: Optional[bool] = True
    category_id: int

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int

    class Config:
        from_attributes = True

# GİRİŞ ŞEMALARI
class LoginRequest(BaseModel):
    password: str

class TokenResponse(BaseModel):
    token: str

# AYAR ŞEMALARI
class SettingBase(BaseModel):
    key: str
    value: str

class SettingCreate(SettingBase):
    pass

class Setting(SettingBase):
    class Config:
        from_attributes = True