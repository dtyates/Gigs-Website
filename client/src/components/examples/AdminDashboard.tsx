import { AdminDashboard } from '../AdminDashboard';

export default function AdminDashboardExample() {
  return (
    <AdminDashboard
      onCreateEvent={() => console.log('Create event')}
      onEditEvent={(eventId) => console.log('Edit event:', eventId)}
      onDeleteEvent={(eventId) => console.log('Delete event:', eventId)}
      onSuspendUser={(userId) => console.log('Suspend user:', userId)}
    />
  );
}