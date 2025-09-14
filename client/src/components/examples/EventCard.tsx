import { EventCard } from '../EventCard';
import festivalImage from '@assets/generated_images/festival_main_stage_sunset_d833fa8d.png';

export default function EventCardExample() {
  return (
    <div className="max-w-sm">
      <EventCard
        id="1"
        name="Electric Dreams Festival"
        date="Aug 15-17, 2024"
        location="Golden Gate Park, SF"
        image={festivalImage}
        description="Three days of electronic music featuring world-class DJs and immersive visual experiences under the stars."
        attendeeCount={12450}
        isAttending={false}
        artistCount={85}
        tags={["Electronic", "EDM", "Techno"]}
        onAttendToggle={(id) => console.log('Attend toggled for:', id)}
        onViewDetails={(id) => console.log('View details for:', id)}
      />
    </div>
  );
}