import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const port = Number(process.env.VITE_PORT) || 3000;

  return defineConfig({
    plugins: [react()],
    server: { port, strictPort: true, host: true },
    preview: { port, strictPort: true, host: true },
  });
};
