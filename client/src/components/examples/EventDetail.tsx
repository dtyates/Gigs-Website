import { EventDetail } from '../EventDetail';
import festivalImage from '@assets/generated_images/festival_main_stage_sunset_d833fa8d.png';

export default function EventDetailExample() {
  // todo: remove mock functionality
  const mockArtists = [
    {
      id: "1",
      name: "Calvin Harris",
      stage: "Main Stage",
      time: "10:00 PM - 11:30 PM",
      isHeadliner: true
    },
    {
      id: "2", 
      name: "Disclosure",
      stage: "Main Stage",
      time: "8:30 PM - 10:00 PM",
      isHeadliner: true
    },
    {
      id: "3",
      name: "ODESZA",
      stage: "Electronic Tent",
      time: "7:00 PM - 8:00 PM", 
      isHeadliner: false
    },
    {
      id: "4",
      name: "Flume",
      stage: "Electronic Tent",
      time: "5:30 PM - 6:30 PM",
      isHeadliner: false
    },
    {
      id: "5",
      name: "Bonobo",
      stage: "Ambient Stage", 
      time: "4:00 PM - 5:00 PM",
      isHeadliner: false
    }
  ];

  return (
    <EventDetail
      id="1"
      name="Electric Dreams Festival"
      date="August 15-17, 2024"
      location="Golden Gate Park, San Francisco"
      image={festivalImage}
      description="Electric Dreams Festival is a three-day celebration of electronic music culture, bringing together world-renowned DJs, cutting-edge visual artists, and music lovers from around the globe. Set in the heart of San Francisco's Golden Gate Park, this immersive experience features multiple stages showcasing everything from deep house to experimental bass music. Beyond the music, attendees can explore art installations, food vendors, and interactive experiences that blur the lines between technology and creativity."
      attendeeCount={12450}
      isAttending={false}
      artists={mockArtists}
      tags={["Electronic", "EDM", "Techno", "House"]}
      onBack={() => console.log('Back clicked')}
      onAttendToggle={(id) => console.log('Attend toggled for:', id)}
      onAddToSchedule={(artistId) => console.log('Add to schedule:', artistId)}
    />
  );
}