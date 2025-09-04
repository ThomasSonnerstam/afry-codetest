import { useQuery } from "@tanstack/react-query";
import {
  listCompanies,
  listEmployees,
  listPersons,
  listUnassignedPersons,
} from "../api/storage";
import { queryKeys } from "../api/queryKeys";

export function usePersons() {
  return useQuery({ queryKey: queryKeys.persons, queryFn: listPersons });
}

export function useCompanies() {
  return useQuery({ queryKey: queryKeys.companies, queryFn: listCompanies });
}

export function useEmployees(companyId: string | "") {
  return useQuery({
    queryKey: companyId
      ? queryKeys.employees(companyId)
      : (["employees", ""] as const),
    queryFn: () => listEmployees(companyId as string),
    enabled: !!companyId,
  });
}

export function useUnassignedPersons() {
  return useQuery({
    queryKey: queryKeys.unassigned,
    queryFn: listUnassignedPersons,
  });
}
