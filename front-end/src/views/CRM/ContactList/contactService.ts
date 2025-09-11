import { Contact } from "@/components/CRM/TableContact/TableContact";

const API_URL = "http://localhost:3001/contacts";

export async function getContact(id: string): Promise<Contact> {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("API error");
  return res.json();
}

export async function getContacts(): Promise<Contact[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("API error");
  return res.json();
}

export async function createContact(contact: Omit<Contact, "id" | "key">): Promise<Contact> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contact),
  });
  if (!res.ok) throw new Error("API error");
  return res.json();
}

export async function updateContact(id: string, contact: Partial<Contact>): Promise<Contact> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT", // hoặc PATCH nếu BE cho phép
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contact),
  });
  if (!res.ok) throw new Error("API error");
  return res.json();
}

export async function deleteContact(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("API error");
}
