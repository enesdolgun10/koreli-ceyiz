from sqlalchemy.orm import Session
import models
import schemas

def get_categories(db: Session):
    return db.query(models.Category).all()

def create_category(db: Session, category: schemas.CategoryCreate):
    db_category = models.Category(
        name=category.name, 
        description=category.description,
        image_url=category.image_url # YENİ EKLENDİ
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def delete_category(db: Session, category_id: int):
    db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if db_category:
        db.delete(db_category)
        db.commit()
        return True
    return False

def get_products(db: Session):
    return db.query(models.Product).all()

# BUNU YENİ EKLİYORSUN: Tek bir ürünü ID'sine göre çeker
def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def get_products_by_category(db: Session, category_id: int):
    return db.query(models.Product).filter(models.Product.category_id == category_id).all()

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(
        name=product.name,
        description=product.description,
        price=product.price,
        old_price=product.old_price, 
        image_url=product.image_url, 
        gallery_urls=product.gallery_urls, # YENİ EKLENDİ
        stock_quantity=product.stock_quantity,
        is_active=product.is_active,
        category_id=product.category_id
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, product: schemas.ProductCreate):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product:
        db_product.name = product.name
        db_product.description = product.description
        db_product.price = product.price
        db_product.old_price = product.old_price 
        db_product.image_url = product.image_url 
        db_product.gallery_urls = product.gallery_urls # YENİ EKLENDİ
        db_product.stock_quantity = product.stock_quantity
        db_product.is_active = product.is_active
        db_product.category_id = product.category_id
        db.commit()
        db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product:
        db.delete(db_product)
        db.commit()
        return True
    return False

def get_setting(db: Session, key: str):
    return db.query(models.Setting).filter(models.Setting.key == key).first()

def get_settings(db: Session):
    return db.query(models.Setting).all()

def update_or_create_setting(db: Session, key: str, value: str):
    db_setting = db.query(models.Setting).filter(models.Setting.key == key).first()
    if db_setting:
        db_setting.value = value
    else:
        db_setting = models.Setting(key=key, value=value)
        db.add(db_setting)
    db.commit()
    db.refresh(db_setting)
    return db_setting