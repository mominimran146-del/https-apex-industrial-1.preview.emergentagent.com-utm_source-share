"""Backend API tests for Apex Industrial Engineering Solutions."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL")
if not BASE_URL:
    # fall back to frontend .env file
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip()
                break
BASE_URL = BASE_URL.rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "apex.engg146@gmail.com"
ADMIN_PASSWORD = "Apex@2025"


# ------------------ fixtures ------------------
@pytest.fixture(scope="session")
def admin_token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"admin login failed: {r.text}"
    data = r.json()
    assert data["user"]["role"] == "admin"
    return data["access_token"]


@pytest.fixture(scope="session")
def admin_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


@pytest.fixture(scope="session")
def customer():
    email = f"test_cust_{uuid.uuid4().hex[:6]}@example.com"
    pw = "Test@1234"
    r = requests.post(f"{API}/auth/register", json={
        "name": "Test Customer", "email": email, "password": pw,
        "phone": "9999999999", "company": "TestCo"
    })
    assert r.status_code == 200, f"register failed: {r.text}"
    data = r.json()
    assert data["user"]["role"] == "customer"
    return {"email": email, "password": pw, "token": data["access_token"], "id": data["user"]["id"]}


@pytest.fixture(scope="session")
def customer_headers(customer):
    return {"Authorization": f"Bearer {customer['token']}"}


# ------------------ Public ------------------
class TestPublicServices:
    def test_list_services(self):
        r = requests.get(f"{API}/services")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list) and len(data) > 0
        assert "title" in data[0] and "category" in data[0]

    def test_category_filter(self):
        r = requests.get(f"{API}/services", params={"category": "Mechanical Design & Drafting"})
        assert r.status_code == 200
        for s in r.json():
            assert s["category"] == "Mechanical Design & Drafting"

    def test_categories(self):
        r = requests.get(f"{API}/services/categories")
        assert r.status_code == 200
        assert len(r.json()) >= 1


class TestContact:
    def test_create_contact(self):
        r = requests.post(f"{API}/contact", json={
            "name": "TEST_John", "email": "test@example.com",
            "phone": "9990001111", "subject": "Inquiry", "message": "Hello"
        })
        assert r.status_code == 200
        assert "id" in r.json()


class TestPublicProposal:
    def test_guest_proposal(self):
        payload = {
            "customer_name": "TEST_Guest", "customer_email": "guest@example.com",
            "customer_phone": "9001112222", "company": "GuestCo",
            "items": [{"service_slug": "2d-drafting", "title": "2D Drafting",
                       "category": "Mechanical Design & Drafting", "quantity": 2}],
            "project_type": "online", "budget": "1L", "timeline": "1 month",
            "details": "Need urgent",
        }
        r = requests.post(f"{API}/proposals", json=payload)
        assert r.status_code == 200
        data = r.json()
        assert data["ref"].startswith("APX-")
        assert data["proposal"]["status"] == "pending"


# ------------------ Auth ------------------
class TestAuth:
    def test_admin_login(self, admin_token):
        assert isinstance(admin_token, str) and len(admin_token) > 20

    def test_me(self, customer_headers, customer):
        r = requests.get(f"{API}/auth/me", headers=customer_headers)
        assert r.status_code == 200
        assert r.json()["email"] == customer["email"]
        assert r.json()["role"] == "customer"

    def test_invalid_login(self):
        r = requests.post(f"{API}/auth/login", json={"email": "no@no.com", "password": "wrong"})
        assert r.status_code == 401

    def test_me_unauthenticated(self):
        r = requests.get(f"{API}/auth/me")
        assert r.status_code == 401


# ------------------ Customer ------------------
class TestCustomerProposals:
    def test_authed_proposal_visible_in_my(self, customer_headers, customer):
        payload = {
            "customer_name": "TEST_AuthCust", "customer_email": customer["email"],
            "items": [{"service_slug": "3d-modeling", "title": "3D Modeling",
                       "category": "Mechanical Design & Drafting", "quantity": 1}],
            "project_type": "online",
        }
        r = requests.post(f"{API}/proposals", json=payload, headers=customer_headers)
        assert r.status_code == 200
        ref = r.json()["ref"]

        r2 = requests.get(f"{API}/my/proposals", headers=customer_headers)
        assert r2.status_code == 200
        refs = [p["ref"] for p in r2.json()]
        assert ref in refs


# ------------------ Admin ------------------
class TestAdmin:
    def test_admin_proposals_list(self, admin_headers):
        r = requests.get(f"{API}/admin/proposals", headers=admin_headers)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_admin_proposals_filter_status(self, admin_headers):
        r = requests.get(f"{API}/admin/proposals", headers=admin_headers, params={"status": "pending"})
        assert r.status_code == 200
        for p in r.json():
            assert p["status"] == "pending"

    def test_admin_proposals_search(self, admin_headers):
        r = requests.get(f"{API}/admin/proposals", headers=admin_headers, params={"search": "TEST"})
        assert r.status_code == 200

    def test_admin_forbidden_for_customer(self, customer_headers):
        r = requests.get(f"{API}/admin/proposals", headers=customer_headers)
        assert r.status_code == 403

    def test_admin_unauthorized_no_token(self):
        r = requests.get(f"{API}/admin/proposals")
        assert r.status_code == 401

    def test_admin_update_and_delete_proposal(self, admin_headers):
        # create a proposal
        payload = {
            "customer_name": "TEST_AdminTarget", "customer_email": "atarget@example.com",
            "items": [{"service_slug": "ga-drawings", "title": "GA Drawings",
                       "category": "Mechanical Design & Drafting", "quantity": 1}],
        }
        cr = requests.post(f"{API}/proposals", json=payload)
        assert cr.status_code == 200
        pid = cr.json()["proposal"]["id"]

        # update
        ur = requests.put(f"{API}/admin/proposals/{pid}", headers=admin_headers,
                          json={"status": "in-progress", "amount": 12345.67})
        assert ur.status_code == 200
        data = ur.json()
        assert data["status"] == "in-progress"
        assert data["amount"] == 12345.67

        # verify via get list contains updated
        list_r = requests.get(f"{API}/admin/proposals", headers=admin_headers, params={"search": "TEST_AdminTarget"})
        assert list_r.status_code == 200
        found = [p for p in list_r.json() if p["id"] == pid]
        assert found and found[0]["status"] == "in-progress"

        # delete
        dr = requests.delete(f"{API}/admin/proposals/{pid}", headers=admin_headers)
        assert dr.status_code == 200

    def test_admin_customers(self, admin_headers):
        r = requests.get(f"{API}/admin/customers", headers=admin_headers)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        if data:
            c = data[0]
            assert "order_count" in c and "total_spent" in c and "type" in c

    def test_admin_analytics(self, admin_headers):
        r = requests.get(f"{API}/admin/analytics", headers=admin_headers)
        assert r.status_code == 200
        d = r.json()
        for k in ["total_revenue", "total_projects", "status_counts",
                  "top_services", "monthly", "repeat_customers", "new_customers"]:
            assert k in d

    def test_admin_export_excel(self, admin_headers):
        r = requests.get(f"{API}/admin/export/proposals", headers=admin_headers)
        assert r.status_code == 200
        ct = r.headers.get("content-type", "")
        assert "spreadsheetml" in ct or "officedocument" in ct
        # xlsx files start with PK zip header
        assert r.content[:2] == b"PK"
        assert "attachment" in r.headers.get("content-disposition", "").lower()


# ------------------ Admin services CRUD ------------------
class TestAdminServices:
    def test_services_crud(self, admin_headers):
        # create
        new = {"title": "TEST_TempService", "category": "Digital Technical Services",
               "description": "temp", "image": "", "price_from": 100, "unit": "project",
               "features": ["f1"], "active": True}
        cr = requests.post(f"{API}/admin/services", headers=admin_headers, json=new)
        assert cr.status_code == 200
        created = cr.json()
        sid = created["id"]

        # appears in public
        pub = requests.get(f"{API}/services").json()
        assert any(s["id"] == sid for s in pub)

        # update
        new["title"] = "TEST_TempServiceUpdated"
        new["price_from"] = 200
        ur = requests.put(f"{API}/admin/services/{sid}", headers=admin_headers, json=new)
        assert ur.status_code == 200
        assert ur.json()["title"] == "TEST_TempServiceUpdated"
        assert ur.json()["price_from"] == 200

        # delete
        dr = requests.delete(f"{API}/admin/services/{sid}", headers=admin_headers)
        assert dr.status_code == 200
        # verify not in public anymore
        pub2 = requests.get(f"{API}/services").json()
        assert not any(s["id"] == sid for s in pub2)
