import { Navigation } from '../Navigation';

export default function NavigationExample() {
  // todo: remove mock functionality
  const mockUser = {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: undefined
  };

  return (
    <Navigation
      user={mockUser}
      currentPage="events"
      notificationCount={3}
      onNavigate={(page) => console.log('Navigate to:', page)}
      onLogin={() => console.log('Login clicked')}
      onLogout={() => console.log('Logout clicked')}
    />
  );
}