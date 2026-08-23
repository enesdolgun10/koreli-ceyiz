from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base # Kendi veritabanı bağlantı dosyanın adıyla eşleştiğinden emin ol

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True) # Koleksiyonlara özel açıklama metni
    image_url = Column(String, nullable=True)   # Kategori kapak görseli
    
    # KİLİT NOKTA: Kategori ile ürünleri birbirine bağlayan ilişki eklendi
    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    price = Column(Float)
    old_price = Column(Float, nullable=True)
    image_url = Column(String, nullable=True)
    gallery_urls = Column(JSON, default=list) # Çoklu fotoğraflar için JSON liste
    stock_quantity = Column(Integer, default=10)
    is_active = Column(Boolean, default=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    
    # KİLİT NOKTA: Ürünün hangi kategoriye ait olduğunu bağlayan ilişki eklendi
    category = relationship("Category", back_populates="products")

class Setting(Base):
    __tablename__ = "settings"
    
    key = Column(String, primary_key=True, index=True)
    value = Column(String)