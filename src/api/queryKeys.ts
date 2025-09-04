export const queryKeys = {
  persons: ["persons"] as const,
  companies: ["companies"] as const,
  employees: (companyId: string) => ["employees", companyId] as const,
  unassigned: ["unassigned"] as const,
};
