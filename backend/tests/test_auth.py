from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_register_and_login():
    # register
    r = client.post("/api/auth/register", json={"email": "user@example.com", "password": "secret123"})
    assert r.status_code == 201, r.text
    data = r.json()
    assert data["email"] == "user@example.com"
    assert data["role"] == "user"

    # login
    r = client.post("/api/auth/login", json={"email": "user@example.com", "password": "secret123"})
    assert r.status_code == 200
    token = r.json().get("access_token")
    assert token
