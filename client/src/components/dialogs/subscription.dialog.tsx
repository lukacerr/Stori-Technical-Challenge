import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface ISubscriptionResponse {
  name?: string;
  email: string;
  categories: {
    name: string;
  }[];
}

export default function SubscriptionDialog({ res }: React.PropsWithRef<{ res: ISubscriptionResponse }>) {
  const navigate = useNavigate();

  return (
    <Dialog open={true} aria-labelledby="subscription-dialog">
      <DialogTitle id="error-dialog-title">Thanks for your subscription!</DialogTitle>
      <DialogContent>
        {res.name && <DialogContentText>{`Welcome ${res.name}!`}</DialogContentText>}
        <DialogContentText>
          We have successfully registered the email <b>{res.email}</b> for the following categories:{' '}
          <i>{res.categories.map((c) => c.name).join(', ')}</i>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => navigate('/news', { replace: true })}>See previous news</Button>
      </DialogActions>
    </Dialog>
  );
}
