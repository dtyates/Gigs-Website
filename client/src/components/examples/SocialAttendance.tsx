import { SocialAttendance } from '../SocialAttendance';

export default function SocialAttendanceExample() {
  // todo: remove mock functionality
  const mockFriends = [
    {
      id: "1",
      name: "Sarah Chen",
      avatar: undefined,
      isFriend: true
    },
    {
      id: "2", 
      name: "Mike Rodriguez",
      avatar: undefined,
      isFriend: true
    }
  ];

  const mockOtherAttendees = [
    {
      id: "3",
      name: "Emma Thompson",
      avatar: undefined,
      isFriend: false,
      mutualFriends: 3
    },
    {
      id: "4",
      name: "David Kim",
      avatar: undefined,
      isFriend: false,
      mutualFriends: 1
    },
    {
      id: "5",
      name: "Lisa Wang",
      avatar: undefined,
      isFriend: false
    }
  ];

  return (
    <SocialAttendance
      eventName="Electric Dreams Festival"
      totalAttendees={12450}
      friendsAttending={mockFriends}
      otherAttendees={mockOtherAttendees}
      onFollowUser={(userId) => console.log('Follow user:', userId)}
      onViewAllAttendees={() => console.log('View all attendees')}
    />
  );
}