from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def auth_headers(email: str, password: str):
    r = client.post("/api/auth/login", json={"email": email, "password": password})
    assert r.status_code == 200, r.text
    token = r.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def ensure_users():
    client.post("/api/auth/register", json={"email": "admin2@example.com", "password": "secret123", "role": "admin"})
    client.post("/api/auth/register", json={"email": "user2@example.com", "password": "secret123"})


def test_purchase_and_restock_flow():
    ensure_users()
    admin_h = auth_headers("admin2@example.com", "secret123")
    user_h = auth_headers("user2@example.com", "secret123")

    # admin creates sweet with qty 2
    r = client.post(
        "/api/sweets",
        json={"name": "Jalebi", "category": "Indian", "price": 5.0, "quantity": 2},
        headers=admin_h,
    )
    assert r.status_code == 201, r.text
    sweet_id = r.json()["id"]

    # user purchases 1
    r = client.post(f"/api/sweets/{sweet_id}/purchase", json={"amount": 1}, headers=user_h)
    assert r.status_code == 200
    assert r.json()["quantity"] == 1

    # user cannot purchase 2 more (insufficient)
    r = client.post(f"/api/sweets/{sweet_id}/purchase", json={"amount": 2}, headers=user_h)
    assert r.status_code == 400

    # admin restocks 5
    r = client.post(f"/api/sweets/{sweet_id}/restock", json={"amount": 5}, headers=admin_h)
    assert r.status_code == 200
    assert r.json()["quantity"] == 6

    # non-admin cannot restock
    r = client.post(f"/api/sweets/{sweet_id}/restock", json={"amount": 1}, headers=user_h)
    assert r.status_code in (401, 403)
