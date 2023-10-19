import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { Box, Chip, InputLabel, LinearProgress, SxProps, Theme } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ErrorDialog from './dialogs/error.dialog';

interface ICategorySelectorProps {
  disabled?: boolean;
  allSelected?: boolean;
  labelText?: string;
  selectedValues?: string[];
  setSelectedValues?: (v: string[]) => void;
  sx?: SxProps<Theme>;
}

export default function CategorySelector({
  disabled = false,
  allSelected = false,
  labelText = 'Categories',
  selectedValues = [],
  setSelectedValues = () => {},
  sx = {},
}: React.PropsWithRef<ICategorySelectorProps>) {
  const { isLoading, error, data } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const values = (await axios.get<string[]>('/categories')).data;
      if (allSelected) setSelectedValues(values);
      return values;
    },
  });

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;

    setSelectedValues(typeof value === 'string' ? value.split(',') : value);
  };

  if (error) return <ErrorDialog error={error} />;

  if (isLoading) return <LinearProgress />;

  return (
    <Box sx={sx}>
      <InputLabel sx={{ top: 'auto', left: 'auto' }} html-for="categories" id="categories-label">
        {labelText}
      </InputLabel>
      <Select
        disabled={disabled}
        fullWidth
        id="categories"
        labelId="categories-label"
        label={labelText}
        multiple
        value={disabled ? data : selectedValues}
        onChange={handleChange}
        renderValue={(values) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {values.map((v) => (
              <Chip key={v} label={v} />
            ))}
          </Box>
        )}
      >
        {data?.map((c) => (
          <MenuItem key={c} value={c}>
            <Checkbox checked={selectedValues?.includes(c)} />
            <ListItemText primary={c} />
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
