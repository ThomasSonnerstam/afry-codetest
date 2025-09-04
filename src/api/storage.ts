export type Company = {
  id: string;
  name: string;
};

export type Person = {
  id: string;
  name: string;
  companyId?: string | null;
};

const STORAGE_KEY = "afry-code-test";

type Database = {
  persons: Person[];
  companies: Company[];
};

export default function loadDb(): Database {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initial: Database = { persons: [], companies: [] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(raw) as Database;
  } catch {
    const fallback: Database = { persons: [], companies: [] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
    return fallback;
  }
}

function saveDb(db: Database): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function generateId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

// ----- Persons -----
export function listPersons(): Promise<Person[]> {
  const db = loadDb();
  return Promise.resolve(db.persons);
}

export function createPerson(
  name: string,
  companyId?: string | null
): Promise<Person> {
  const db = loadDb();
  const person: Person = {
    id: generateId("per"),
    name: name.trim(),
    companyId: companyId ?? null,
  };
  db.persons.push(person);
  saveDb(db);
  return Promise.resolve(person);
}

export function updatePersonCompany(
  personId: string,
  companyId: string | null
): Promise<Person | undefined> {
  const db = loadDb();
  const person = db.persons.find((p) => p.id === personId);
  if (!person) return Promise.resolve(undefined);
  person.companyId = companyId;
  saveDb(db);
  return Promise.resolve(person);
}

// ----- Companies -----
export function listCompanies(): Promise<Company[]> {
  const db = loadDb();
  return Promise.resolve(db.companies);
}

export function createCompany(name: string): Promise<Company> {
  const db = loadDb();
  const company: Company = { id: generateId("com"), name: name.trim() };
  db.companies.push(company);
  saveDb(db);
  return Promise.resolve(company);
}

export function listEmployees(companyId: string): Promise<Person[]> {
  const db = loadDb();
  return Promise.resolve(db.persons.filter((p) => p.companyId === companyId));
}

export function removeEmployeeFromCompany(
  personId: string
): Promise<Person | undefined> {
  return updatePersonCompany(personId, null);
}

export function assignPersonToCompany(
  personId: string,
  companyId: string
): Promise<Person | undefined> {
  return updatePersonCompany(personId, companyId);
}

export function listUnassignedPersons(): Promise<Person[]> {
  const db = loadDb();
  return Promise.resolve(db.persons.filter((p) => !p.companyId));
}
