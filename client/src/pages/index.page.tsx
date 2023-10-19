import { Box, FormControl, TextField, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { LoadingButton } from '@mui/lab';
import CategorySelector from '../components/category.selector';
import { useState } from 'react';
import validator from 'validator';
import { onValueChanged } from '../utils/onValueChanged';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import ErrorDialog from '../components/dialogs/error.dialog';
import SubscriptionDialog from '../components/dialogs/subscription.dialog';

interface ISubscribeForm {
  name?: string;
  email: string;
  categories: string[];
}

export default function IndexPage() {
  const [subscribeForm, setSubscribeForm] = useState<ISubscribeForm>({
    name: '',
    email: '',
    categories: [],
  });

  const validateForm = (form: ISubscribeForm) => form.categories?.length && validator.isEmail(form.email);

  const { isLoading, error, refetch, data } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      if (!validateForm(subscribeForm)) return null;
      const v = (await axios.post('/subscriptions', subscribeForm)).data;

      setSubscribeForm({
        name: '',
        email: '',
        categories: [],
      });

      return v;
    },
  });

  if (error) return <ErrorDialog error={error} />;

  if (data) return <SubscriptionDialog res={data} />;

  return (
    <Box
      textAlign={'center'}
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
      flexDirection={'column'}
      paddingBlock={4}
      gap={4}
    >
      <img src={`https://www.storicard.com/_next/static/media/complete-logo.0f6b7ce5.svg`} alt="Stori" loading="lazy" />
      <Typography variant="h3">Join the newsletter!</Typography>
      <FormControl fullWidth margin="dense" sx={{ gap: 4, paddingInline: 4, maxWidth: '48em' }}>
        <TextField
          value={subscribeForm.name}
          onChange={(v) => onValueChanged('name', v, setSubscribeForm)}
          variant="outlined"
          label="Name"
          placeholder="Your name"
        />
        <TextField
          value={subscribeForm.email}
          onChange={(v) => onValueChanged('email', v, setSubscribeForm)}
          required
          variant="outlined"
          label="Email"
          placeholder="example@host.com"
        />
        <CategorySelector
          selectedValues={subscribeForm.categories}
          setSelectedValues={(v) => onValueChanged('categories', v, setSubscribeForm)}
          allSelected
        />
        <LoadingButton
          disabled={!validateForm(subscribeForm)}
          onClick={() => refetch()}
          size="large"
          variant="contained"
          loading={isLoading}
          endIcon={<SendIcon />}
        >
          Sign me up!
        </LoadingButton>
      </FormControl>
    </Box>
  );
}
