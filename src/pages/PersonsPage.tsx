import type { FormEvent } from "react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPerson } from "../api/storage";
import type { Person } from "../api/storage";
import { useCompanies, usePersons } from "../hooks/queries";
import { queryKeys } from "../api/queryKeys";
import {
  Box,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";

export default function PersonsPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [companyId, setCompanyId] = useState<string | "">("");

  const personsQuery = usePersons();
  const companiesQuery = useCompanies();

  const createPersonMutation = useMutation({
    mutationFn: ({ name, company }: { name: string; company: string | "" }) =>
      createPerson(name, company || null),
    onSuccess: () => {
      setName("");
      setCompanyId("");
      queryClient.invalidateQueries({ queryKey: queryKeys.persons });
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    createPersonMutation.mutate({ name: name, company: companyId });
  }

  return (
    <Box sx={{ maxWidth: 800, padding: "2rem" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create Person
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            gap: 2,
            alignItems: { xs: "stretch", sm: "flex-end" },
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            sx={{ flexGrow: 1 }}
            fullWidth
          />
          <FormControl
            sx={{ minWidth: 200, width: { xs: "100%", sm: "auto" } }}
          >
            <InputLabel id="person-company-label">Company</InputLabel>
            <Select
              labelId="person-company-label"
              id="person-company-select"
              value={companyId}
              label="Company"
              onChange={(e) => setCompanyId(e.target.value)}
            >
              <MenuItem value="">No company</MenuItem>
              {companiesQuery.data?.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            disabled={createPersonMutation.isPending}
            sx={{
              alignSelf: { sm: "center" },
              width: { xs: "100%", sm: "300px" },
              height: "56px",
            }}
          >
            Add Person
          </Button>
        </Box>
      </Paper>

      <Typography variant="h5" component="h2" gutterBottom>
        All Persons
      </Typography>

      <Paper>
        {personsQuery.isLoading ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography>Loading…</Typography>
          </Box>
        ) : personsQuery.data?.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography color="text.secondary">
              No persons have been created yet
            </Typography>
          </Box>
        ) : (
          <List>
            {personsQuery.data?.map((p: Person, index: number) => (
              <Box key={p.id}>
                <ListItem>
                  <ListItemText
                    primary={p.name}
                    secondary={
                      p.companyId
                        ? `Company: ${
                            companiesQuery.data?.find(
                              (c) => c.id === p.companyId
                            )?.name ?? "Unknown"
                          }`
                        : "No company assigned"
                    }
                  />
                </ListItem>
                {index < (personsQuery.data?.length ?? 0) - 1 && <Divider />}
              </Box>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}
