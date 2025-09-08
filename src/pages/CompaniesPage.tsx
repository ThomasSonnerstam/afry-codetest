import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCompany, removeEmployeeFromCompany } from "../api/storage";
import { useCompanies, useEmployees } from "../hooks/queries";
import { queryKeys } from "../api/queryKeys";
import {
  Box,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

export default function CompaniesPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | "">("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [personToDelete, setPersonToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const companiesQuery = useCompanies();
  const employeesQuery = useEmployees(selectedCompanyId);

  const createCompanyMutation = useMutation({
    mutationFn: (name: string) => createCompany(name),
    onSuccess: () => {
      setName("");
      queryClient.invalidateQueries({ queryKey: queryKeys.companies });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (personId: string) => removeEmployeeFromCompany(personId),
    onSuccess: () => {
      if (selectedCompanyId)
        queryClient.invalidateQueries({
          queryKey: queryKeys.employees(selectedCompanyId),
        });
      setDeleteDialogOpen(false);
      setPersonToDelete(null);
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    createCompanyMutation.mutate(name);
  }

  function handleDeleteClick(person: { id: string; name: string }) {
    setPersonToDelete(person);
    setDeleteDialogOpen(true);
  }

  function handleConfirmDelete() {
    if (personToDelete) {
      removeMutation.mutate(personToDelete.id);
    }
  }

  function handleCancelDelete() {
    setDeleteDialogOpen(false);
    setPersonToDelete(null);
  }

  const selectedCompanyName = useMemo(() => {
    return (
      companiesQuery.data?.find((c) => c.id === selectedCompanyId)?.name ?? ""
    );
  }, [companiesQuery.data, selectedCompanyId]);

  return (
    <Box sx={{ maxWidth: 800, padding: "2rem" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create Company
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
            label="Company Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            sx={{ flexGrow: 1 }}
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            disabled={createCompanyMutation.isPending}
            sx={{
              alignSelf: { sm: "center" },
              width: { xs: "100%", sm: "300px" },
              height: "56px",
            }}
          >
            Add Company
          </Button>
        </Box>
      </Paper>

      <Typography variant="h5" component="h2" gutterBottom>
        Companies
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Select a company</InputLabel>
          <Select
            value={selectedCompanyId}
            label="Select a company"
            onChange={(e) => setSelectedCompanyId(e.target.value)}
          >
            <MenuItem value="">Choose a company…</MenuItem>
            {companiesQuery.data?.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {selectedCompanyId && (
        <>
          <Typography variant="h5" component="h3" gutterBottom>
            Employees at {selectedCompanyName}
          </Typography>

          <Paper>
            {employeesQuery.isLoading ? (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography>Loading…</Typography>
              </Box>
            ) : employeesQuery.data?.length === 0 ? (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography>No employees found</Typography>
              </Box>
            ) : (
              <List>
                {employeesQuery.data?.map((p, index) => (
                  <Box key={p.id}>
                    <ListItem
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="remove from company"
                          onClick={() =>
                            handleDeleteClick({ id: p.id, name: p.name })
                          }
                          disabled={removeMutation.isPending}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={p.name} />
                    </ListItem>
                    {index < (employeesQuery.data?.length ?? 0) - 1 && (
                      <Divider />
                    )}
                  </Box>
                ))}
              </List>
            )}
          </Paper>
        </>
      )}

      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Removal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove{" "}
            <strong>{personToDelete?.name}</strong> from{" "}
            <strong>{selectedCompanyName}</strong>?
            <br />
            <br />
            This person will remain in the system but will no longer be
            associated with this company.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={removeMutation.isPending}
          >
            Remove Employee
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
