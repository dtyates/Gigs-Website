import { EventList } from '../EventList';
import festivalImage1 from '@assets/generated_images/festival_main_stage_sunset_d833fa8d.png';
import festivalImage2 from '@assets/generated_images/festival_grounds_overview_0ed3bb27.png';
import festivalImage3 from '@assets/generated_images/DJ_performance_stage_cab17f4a.png';

export default function EventListExample() {
  // todo: remove mock functionality
  const mockEvents = [
    {
      id: "1",
      name: "Electric Dreams Festival",
      date: "Aug 15-17, 2024",
      location: "Golden Gate Park, SF",
      image: festivalImage1,
      description: "Three days of electronic music featuring world-class DJs and immersive visual experiences.",
      attendeeCount: 12450,
      isAttending: true,
      artistCount: 85,
      tags: ["Electronic", "EDM", "Techno"]
    },
    {
      id: "2", 
      name: "Sunset Grooves",
      date: "Sep 22-24, 2024",
      location: "Venice Beach, LA",
      image: festivalImage2,
      description: "Beachside festival celebrating house music and sunset vibes with local and international artists.",
      attendeeCount: 8200,
      isAttending: false,
      artistCount: 45,
      tags: ["House", "Electronic", "Beach"]
    },
    {
      id: "3",
      name: "Bass Underground",
      date: "Oct 5-6, 2024", 
      location: "Warehouse District, NYC",
      image: festivalImage3,
      description: "Underground bass music experience in intimate venue settings with cutting-edge sound systems.",
      attendeeCount: 3500,
      isAttending: false,
      artistCount: 25,
      tags: ["Bass", "Dubstep", "Underground"]
    }
  ];

  return (
    <EventList
      events={mockEvents}
      onAttendToggle={(id) => console.log('Attend toggled for:', id)}
      onViewDetails={(id) => console.log('View details for:', id)}
    />
  );
}