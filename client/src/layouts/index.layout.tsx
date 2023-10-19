import Navbar from '../components/Navbar';

export default function IndexLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
