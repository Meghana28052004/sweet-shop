from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(min_length=6)
    role: Optional[str] = None


class UserOut(UserBase):
    id: int
    role: str

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class SweetBase(BaseModel):
    name: str
    category: str
    price: float = Field(ge=0)
    quantity: int = Field(ge=0)


class SweetCreate(SweetBase):
    pass


class SweetUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = Field(default=None, ge=0)
    quantity: Optional[int] = Field(default=None, ge=0)


class SweetOut(SweetBase):
    id: int

    class Config:
        from_attributes = True
