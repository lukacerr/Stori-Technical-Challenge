import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export default function ErrorDialog({ error }: React.PropsWithRef<{ error: unknown }>) {
  console.error(error);

  return (
    <Dialog open={true} aria-labelledby="error-dialog">
      <DialogTitle id="error-dialog-title">{'An error has ocurred.'}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          We are sorry about this incident. Our team has been already notified and we will be working on it ASAP. Please
          reload the page and try again.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => location.reload()}>Reload</Button>
      </DialogActions>
    </Dialog>
  );
}
