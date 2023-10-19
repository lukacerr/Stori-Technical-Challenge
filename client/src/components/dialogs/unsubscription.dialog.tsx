import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function UnsubscriptionDialog() {
  const navigate = useNavigate();

  return (
    <Dialog open={true} aria-labelledby="subscription-dialog">
      <DialogTitle id="error-dialog-title">Your subscription has been updated.</DialogTitle>
      <DialogContent>
        <DialogContentText>Thanks for your time and interest in Stori Newsletter.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => navigate('/news', { replace: true })}>See previous news</Button>
      </DialogActions>
    </Dialog>
  );
}
