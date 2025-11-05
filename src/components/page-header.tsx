
import { useAppContext } from '@/context/app-context';
import * as React from 'react';
import { useEffect } from 'react';

type PageHeaderProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export default function PageHeader({ title, description, children }: PageHeaderProps) {
  const { setHeaderState } = useAppContext();

  useEffect(() => {
    setHeaderState({ title, description, children });
    // Clear header state on component unmount
    return () => setHeaderState({ title: '' });
  }, [title, description, children, setHeaderState]);

  // This component will no longer render anything itself, it only sets the state.
  return null;
}
