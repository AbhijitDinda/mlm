import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import IconifyIcons from "../../IconifyIcons";
import Iconify from "../../components/Iconify";
import useAuth from "../../hooks/useAuth";
import { fCurrency } from "../../utils/formatNumber";
import { Reactivation } from "./PlanCard";

const ReactivationDialog = ({
  reactivation,
  open,
  handleClose,
}: {
  reactivation: Reactivation;
  open: boolean;
  handleClose: () => void;
}) => {
  const { user } = useAuth();
  const { reactivationLevel } = user ? user : { reactivationLevel: 0 };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle
        sx={{ bgcolor: "background.neutral" }}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        Reactivation
        <IconButton onClick={handleClose}>
          <Iconify icon={IconifyIcons.close} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: 0 }}>
        <TableContainer sx={{ my: 2 }} component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>Amount Income Reached</TableCell>
                <TableCell>Payable Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reactivation?.map(
                ({ amountIncomeReached, payableAmount }, index) => {
                  const icon =
                    index < reactivationLevel
                      ? "lucide:check-circle"
                      : "ri:close-circle-line";
                  const color =
                    index < reactivationLevel ? "success" : "warning";

                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <Iconify
                          color={color + ".main"}
                          sx={{ fontSize: 24 }}
                          icon={icon}
                        />
                      </TableCell>
                      <TableCell>{fCurrency(amountIncomeReached)}</TableCell>
                      <TableCell>{fCurrency(payableAmount)}</TableCell>
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};
export default ReactivationDialog;
