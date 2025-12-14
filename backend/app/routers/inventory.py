from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from ..deps import get_db, get_current_user, get_current_admin
from ..models import Sweet

router = APIRouter(prefix="/api/sweets", tags=["inventory"])


class Amount(BaseModel):
    amount: int = Field(default=1, ge=1)


@router.post("/{sweet_id}/purchase", dependencies=[Depends(get_current_user)])
def purchase_sweet(sweet_id: int, body: Amount, db: Session = Depends(get_db)):
    sweet = db.query(Sweet).get(sweet_id)
    if not sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")
    if sweet.quantity < body.amount:
        raise HTTPException(status_code=400, detail="Insufficient stock")
    sweet.quantity -= body.amount
    db.add(sweet)
    db.commit()
    db.refresh(sweet)
    return {"id": sweet.id, "quantity": sweet.quantity}


@router.post("/{sweet_id}/restock", dependencies=[Depends(get_current_admin)])
def restock_sweet(sweet_id: int, body: Amount, db: Session = Depends(get_db)):
    sweet = db.query(Sweet).get(sweet_id)
    if not sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")
    sweet.quantity += body.amount
    db.add(sweet)
    db.commit()
    db.refresh(sweet)
    return {"id": sweet.id, "quantity": sweet.quantity}
