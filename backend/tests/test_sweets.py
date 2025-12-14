from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def auth_headers(email: str, password: str):
    r = client.post("/api/auth/login", json={"email": email, "password": password})
    assert r.status_code == 200, r.text
    token = r.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def setup_admin_and_user():
    client.post("/api/auth/register", json={"email": "admin@example.com", "password": "secret123", "role": "admin"})
    client.post("/api/auth/register", json={"email": "user@example.com", "password": "secret123"})


def test_sweets_crud_and_search():
    setup_admin_and_user()
    admin_h = auth_headers("admin@example.com", "secret123")
    user_h = auth_headers("user@example.com", "secret123")

    # admin creates sweets
    r = client.post(
        "/api/sweets",
        json={"name": "Ladoo", "category": "Indian", "price": 10.0, "quantity": 50},
        headers=admin_h,
    )
    assert r.status_code == 201, r.text
    sweet_id = r.json()["id"]

    # user can list
    r = client.get("/api/sweets", headers=user_h)
    assert r.status_code == 200
    assert any(s["name"] == "Ladoo" for s in r.json())

    # search
    r = client.get("/api/sweets/search", params={"name": "lad"}, headers=user_h)
    assert r.status_code == 200
    assert len(r.json()) >= 1

    # update (admin only)
    r = client.put(f"/api/sweets/{sweet_id}", json={"price": 12.5}, headers=admin_h)
    assert r.status_code == 200
    assert r.json()["price"] == 12.5

    # non-admin cannot create
    r = client.post(
        "/api/sweets",
        json={"name": "Barfi", "category": "Indian", "price": 15.0, "quantity": 20},
        headers=user_h,
    )
    assert r.status_code in (401, 403)

    # delete (admin)
    r = client.delete(f"/api/sweets/{sweet_id}", headers=admin_h)
    assert r.status_code == 204
