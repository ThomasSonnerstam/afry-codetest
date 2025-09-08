import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignPersonToCompany } from "../api/storage";
import { useCompanies, useUnassignedPersons } from "../hooks/queries";
import { queryKeys } from "../api/queryKeys";
import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export default function UnassignedPage() {
  const queryClient = useQueryClient();
  const unassignedQuery = useUnassignedPersons();
  const companiesQuery = useCompanies();

  const assignMutation = useMutation({
    mutationFn: ({
      personId,
      companyId,
    }: {
      personId: string;
      companyId: string;
    }) => assignPersonToCompany(personId, companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.unassigned });
    },
  });

  return (
    <Box sx={{ maxWidth: 800, padding: "2rem" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Unassigned Persons
      </Typography>

      <Paper>
        {unassignedQuery.isLoading ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography>Loading…</Typography>
          </Box>
        ) : unassignedQuery.data?.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography>No unassigned persons found</Typography>
          </Box>
        ) : (
          <List>
            {unassignedQuery.data?.map((p, index) => (
              <Box key={p.id}>
                <ListItem>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 2,
                      alignItems: { xs: "stretch", sm: "center" },
                      width: "100%",
                    }}
                  >
                    <ListItemText
                      primary={p.name}
                      secondary="Not assigned to any company"
                    />
                    <FormControl
                      sx={{ minWidth: 200, width: { xs: "100%", sm: "auto" } }}
                    >
                      <InputLabel id={`assign-company-label-${p.id}`}>
                        Assign to company
                      </InputLabel>
                      <Select
                        labelId={`assign-company-label-${p.id}`}
                        id={`assign-company-select-${p.id}`}
                        defaultValue=""
                        label="Assign to company"
                        onChange={(e) => {
                          const cid = e.target.value;
                          if (cid)
                            assignMutation.mutate({
                              personId: p.id,
                              companyId: cid,
                            });
                        }}
                      >
                        <MenuItem value="" disabled>
                          Choose a company…
                        </MenuItem>
                        {companiesQuery.data?.map((c) => (
                          <MenuItem key={c.id} value={c.id}>
                            {c.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </ListItem>
                {index < (unassignedQuery.data?.length ?? 0) - 1 && <Divider />}
              </Box>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}
