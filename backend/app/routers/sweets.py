from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..deps import get_db, get_current_user, get_current_admin
from ..models import Sweet
from ..schemas import SweetCreate, SweetUpdate, SweetOut

router = APIRouter(prefix="/api/sweets", tags=["sweets"])


@router.post("", response_model=SweetOut, dependencies=[Depends(get_current_admin)], status_code=201)
def create_sweet(payload: SweetCreate, db: Session = Depends(get_db)):
    sweet = Sweet(**payload.model_dump())
    db.add(sweet)
    db.commit()
    db.refresh(sweet)
    return sweet


@router.get("", response_model=List[SweetOut], dependencies=[Depends(get_current_user)])
def list_sweets(db: Session = Depends(get_db)):
    return db.query(Sweet).all()


@router.get("/search", response_model=List[SweetOut], dependencies=[Depends(get_current_user)])
def search_sweets(
    name: Optional[str] = None,
    category: Optional[str] = None,
    minPrice: Optional[float] = Query(None, ge=0),
    maxPrice: Optional[float] = Query(None, ge=0),
    db: Session = Depends(get_db),
):
    q = db.query(Sweet)
    if name:
        q = q.filter(Sweet.name.ilike(f"%{name}%"))
    if category:
        q = q.filter(Sweet.category.ilike(f"%{category}%"))
    if minPrice is not None:
        q = q.filter(Sweet.price >= minPrice)
    if maxPrice is not None:
        q = q.filter(Sweet.price <= maxPrice)
    return q.all()


@router.put("/{sweet_id}", response_model=SweetOut, dependencies=[Depends(get_current_admin)])
def update_sweet(sweet_id: int, payload: SweetUpdate, db: Session = Depends(get_db)):
    sweet = db.query(Sweet).get(sweet_id)
    if not sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")
    data = payload.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(sweet, k, v)
    db.add(sweet)
    db.commit()
    db.refresh(sweet)
    return sweet


@router.delete("/{sweet_id}", status_code=204, dependencies=[Depends(get_current_admin)])
def delete_sweet(sweet_id: int, db: Session = Depends(get_db)):
    sweet = db.query(Sweet).get(sweet_id)
    if not sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")
    db.delete(sweet)
    db.commit()
    return None
