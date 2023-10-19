import {
  Box,
  Divider,
  FormControl,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  TextField,
  ToggleButton,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { DispatchState, onValueChanged } from '../../utils/onValueChanged';
import LoginIcon from '@mui/icons-material/Login';
import { LoadingButton } from '@mui/lab';
import { DateTimePicker } from '@mui/x-date-pickers';
import ErrorDialog from '../../components/dialogs/error.dialog';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { SetSessionToken } from '../../axios';
import CategorySelector from '../../components/category.selector';
import DeleteIcon from '@mui/icons-material/Delete';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import dayjs, { Dayjs } from 'dayjs';
import FileUpload from 'react-material-file-upload';
import validator from 'validator';

interface ILoginForm {
  password: string;
}

function AdminLogin({
  loginForm,
  setLoginForm,
  isLoading = true,
  refetch,
  validateForm,
  failedLogin = false,
}: React.PropsWithRef<{
  loginForm: ILoginForm;
  setLoginForm: DispatchState<ILoginForm>;
  isLoading?: boolean;
  refetch: () => void;
  validateForm: (f: ILoginForm) => boolean;
  failedLogin?: boolean;
}>) {
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
      <Typography variant="h3">ADMIN PANEL</Typography>
      <FormControl fullWidth margin="dense" sx={{ gap: 4, paddingInline: 4, maxWidth: '48em' }}>
        <TextField
          value={loginForm.password}
          onChange={(v) => onValueChanged('password', v, setLoginForm)}
          variant="outlined"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="123456"
          error={failedLogin}
          helperText={failedLogin && 'The provided password is not correct.'}
        />
        <LoadingButton
          disabled={!validateForm(loginForm)}
          onClick={() => refetch()}
          size="large"
          variant="contained"
          loading={isLoading}
          endIcon={<LoginIcon />}
        >
          Log in
        </LoadingButton>
      </FormControl>
    </Box>
  );
}

function CategorySection() {
  const [categoryText, setCategoryText] = useState('');

  const createQuery = useQuery({
    queryKey: ['create-category'],
    queryFn: async () => {
      if (!categoryText) return null;
      setCategoryText('');

      const v = await axios.post('/categories', { name: categoryText });
      location.reload();
      return v;
    },
  });

  const deleteQuery = useQuery({
    queryKey: ['delete-category'],
    queryFn: async () => {
      if (!categoryText) return null;
      setCategoryText('');

      const v = await axios.delete(`/categories/${categoryText}`);
      location.reload();
      return v;
    },
  });

  if (createQuery.error || deleteQuery.error) return <ErrorDialog error={createQuery.error || deleteQuery.error} />;

  return (
    <>
      <Typography variant="h5">Manage categories</Typography>
      <Box>
        <TextField
          value={categoryText}
          onChange={(v) => setCategoryText(v.target?.value ?? '')}
          variant="filled"
          fullWidth
          label="Category tag"
          placeholder="Example"
        />
        <Box display={'flex'} gap={2} padding={2}>
          <LoadingButton
            onClick={() => createQuery.refetch()}
            loading={createQuery.isLoading || deleteQuery.isLoading}
            disabled={!categoryText}
            variant="contained"
            fullWidth
          >
            Create category
          </LoadingButton>
          <LoadingButton
            onClick={() => deleteQuery.refetch()}
            loading={createQuery.isLoading || deleteQuery.isLoading}
            disabled={!categoryText}
            fullWidth
          >
            Delete category
          </LoadingButton>
        </Box>
        <CategorySelector labelText="Existing categories" disabled allSelected />
      </Box>
    </>
  );
}

function ScheduledSection() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['get-scheduled'],
    queryFn: async () => {
      const v = await axios.get('/news/scheduled');
      return v.data;
    },
  });

  const deleteNew = async (id: number) => {
    await axios.delete(`/news/${id}`);
    location.reload();
  };

  if (isLoading) return <LinearProgress />;

  if (error) return <ErrorDialog error={error} />;

  return (
    <>
      <Typography variant="h5">Scheduled news</Typography>
      {!data?.length ? (
        <span style={{ opacity: 0.625, fontStyle: 'italic' }}>No scheduled news found.</span>
      ) : (
        <List>
          {data.map((n: { id: number; subject: string; scheduled: string; categories: { name: string }[] }) => (
            <ListItem
              key={n.id}
              secondaryAction={
                <IconButton onClick={() => deleteNew(n.id)} edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={
                  <>
                    <b style={{ paddingRight: 12 }}>[{dayjs(n.scheduled).format('M/D/YYYY h:mm A')}]</b>
                    <span>{n.subject}</span>
                  </>
                }
                secondary={<i>{`Categories: ${n.categories.map((c) => c.name).join(', ')}`}</i>}
              />
            </ListItem>
          ))}
        </List>
      )}
    </>
  );
}

interface INewForm {
  categories: string[];
  subject: string;
  content: string;
  scheduled?: Dayjs;
  schedule: boolean;
  extraRecipients: string;
}

function CreateSection() {
  const [newForm, setNewForm] = useState<INewForm>({
    categories: [],
    subject: '',
    content: '',
    scheduled: dayjs().add(1, 'day'),
    schedule: false,
    extraRecipients: '',
  });

  const [files, setFiles] = useState<File[]>([]);

  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateForm = (form: INewForm) => {
    return (
      form.subject &&
      form.content &&
      (!form.extraRecipients || form.extraRecipients.split(', ').every((v) => validator.isEmail(v))) &&
      (form.categories.length || form.extraRecipients) &&
      (!form.schedule || form.scheduled?.isAfter(Date.now()))
    );
  };

  const createNew = async (form: INewForm) => {
    setIsLoading(true);

    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));
    Object.keys(form).forEach((key) => formData.append(key, `${form[key as keyof INewForm]}`));

    formData.delete('categories');
    form.categories.forEach((c) => formData.append('categories', c));

    formData.delete('schedule');
    if (!form.schedule) formData.delete('scheduled');

    formData.delete('extraRecipients');
    if (form.extraRecipients) form.extraRecipients.split(', ').forEach((v) => formData.append('extraRecipients', v));

    await axios
      .post('/news', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .catch(setError)
      .finally(() => !error && location.reload());
  };

  if (error) return <ErrorDialog error={error} />;

  return (
    <>
      <Typography variant="h5">Create a new</Typography>
      <FormControl fullWidth sx={{ gap: 4, paddingInline: 4 }}>
        <Box display={'flex'} gap={4}>
          <TextField
            sx={{ flex: 1 }}
            value={newForm.subject}
            onChange={(v) => onValueChanged('subject', v, setNewForm)}
            variant="outlined"
            label="Subject"
            placeholder="New's title"
          />
          <CategorySelector
            sx={{ flex: 1 }}
            selectedValues={newForm.categories}
            setSelectedValues={(v) => onValueChanged('categories', v, setNewForm)}
            allSelected
          />
        </Box>
        <TextField
          multiline
          value={newForm.content}
          onChange={(v) => onValueChanged('content', v, setNewForm)}
          variant="outlined"
          label="Content"
          placeholder="New's notes (raw or HTML format allowed)."
        />
        <FileUpload title="New's attachments" value={files} onChange={setFiles} />
        <Box display={'flex'} gap={4}>
          <ToggleButton
            sx={{ flex: 1 }}
            value="check"
            selected={!newForm.schedule}
            onClick={() => onValueChanged('schedule', !newForm.schedule, setNewForm)}
          >
            Send at the moment
          </ToggleButton>
          <DateTimePicker
            sx={{ flex: 1 }}
            disabled={!newForm.schedule}
            label="Schedule for"
            value={newForm.scheduled}
            onChange={(v) => onValueChanged('scheduled', v, setNewForm)}
          />
          <TextField
            sx={{ flex: 1 }}
            multiline
            value={newForm.extraRecipients}
            onChange={(v) => onValueChanged('extraRecipients', v, setNewForm)}
            variant="outlined"
            label="Extra recipients (comma separated)"
            placeholder="example1@host.com, example2@host.com"
          />
        </Box>

        <LoadingButton
          disabled={!validateForm(newForm)}
          onClick={() => createNew(newForm)}
          loading={isLoading}
          size="large"
          variant="contained"
          endIcon={<NewReleasesIcon />}
        >
          {newForm.schedule ? 'Schedule' : 'Send'} new
        </LoadingButton>
      </FormControl>
    </>
  );
}

function AdminPanel() {
  return (
    <Box padding={'4% 2%'} display={'flex'} flexDirection={'column'} gap={2}>
      <CategorySection />
      <Divider sx={{ margin: '1% 2%' }} />
      <ScheduledSection />
      <Divider sx={{ margin: '1% 2%' }} />
      <CreateSection />
    </Box>
  );
}

export default function AdminPage() {
  const [loginForm, setLoginForm] = useState<ILoginForm>({
    password: sessionStorage.getItem('Authorization') || '',
  });

  const validateLoginForm = (form: ILoginForm) => form.password.length > 1;

  const { isLoading, error, refetch, data } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      if (!validateLoginForm(loginForm)) return null;
      SetSessionToken(loginForm.password);

      return axios
        .get('/auth')
        .then((res) => res.status >= 200 && res.status < 400)
        .catch(() => false);
    },
  });

  if (error) return <ErrorDialog error={error} />;

  if (!data)
    return (
      <AdminLogin
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        isLoading={isLoading}
        refetch={refetch}
        validateForm={validateLoginForm}
        failedLogin={data === false}
      />
    );

  return <AdminPanel />;
}
