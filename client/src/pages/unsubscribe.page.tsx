import { Box, FormControl, LinearProgress, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from '@mui/lab';
import CategorySelector from '../components/category.selector';
import { onValueChanged } from '../utils/onValueChanged';
import { useState } from 'react';
import validator from 'validator';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ErrorDialog from '../components/dialogs/error.dialog';
import UnsubscriptionDialog from '../components/dialogs/unsubscription.dialog';

interface IUpdateSubForm {
  email: string;
  categories: string[];
}

export default function UnsubscribePage() {
  const [updateSubForm, setUpdateSubForm] = useState<IUpdateSubForm>({
    email: new URL(location.toString()).searchParams.get('email') || '',
    categories: [],
  });

  const { isLoading, error, data } = useQuery({
    queryKey: ['subscription', validator.isEmail(updateSubForm.email) && updateSubForm.email],
    queryFn: async () => {
      if (!validator.isEmail(updateSubForm.email)) return [];
      const v = (await axios.get<string[]>(`/subscriptions/${updateSubForm.email}`)).data || [];
      onValueChanged('categories', v, setUpdateSubForm);
      return v;
    },
  });

  const validateForm = (form: IUpdateSubForm) => data?.length && validator.isEmail(form.email);

  const submitQuery = useQuery({
    queryKey: ['subscription-patch'],
    queryFn: async () => {
      if (!validateForm(updateSubForm)) return null;

      const endpoint = `/subscriptions/${updateSubForm.email}`;

      const res = updateSubForm.categories.length
        ? (await axios.patch(endpoint, updateSubForm)).data
        : (await axios.delete(endpoint)).data;

      setUpdateSubForm({
        email: '',
        categories: [],
      });

      return res;
    },
  });

  if (error || submitQuery.error) return <ErrorDialog error={{ error, submitQ: submitQuery.error }} />;

  if (submitQuery.data) return <UnsubscriptionDialog />;

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
      <Typography variant="h3">Update your subscription</Typography>
      <FormControl fullWidth margin="dense" sx={{ gap: 4, paddingInline: 4, maxWidth: '48em' }}>
        <TextField
          value={updateSubForm.email}
          onChange={(v) => onValueChanged('email', v, setUpdateSubForm)}
          required
          variant="outlined"
          label="Email"
          placeholder="example@host.com"
        />
        {isLoading ? (
          <LinearProgress />
        ) : (
          <CategorySelector
            selectedValues={updateSubForm.categories}
            setSelectedValues={(v) => onValueChanged('categories', v, setUpdateSubForm)}
            disabled={!validator.isEmail(updateSubForm.email)}
          />
        )}
        <LoadingButton
          disabled={!validateForm(updateSubForm)}
          onClick={() => submitQuery.refetch()}
          loading={submitQuery.isLoading}
          size="large"
          variant="contained"
          endIcon={
            updateSubForm.categories.length || !validator.isEmail(updateSubForm.email) ? <EditIcon /> : <DeleteIcon />
          }
        >
          {updateSubForm.categories.length || !validator.isEmail(updateSubForm.email)
            ? 'Update subscription'
            : 'Unsubscribe'}
        </LoadingButton>
      </FormControl>
    </Box>
  );
}
