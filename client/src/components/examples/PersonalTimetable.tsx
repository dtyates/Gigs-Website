import { PersonalTimetable } from '../PersonalTimetable';

export default function PersonalTimetableExample() {
  // todo: remove mock functionality
  const mockScheduleItems = [
    {
      id: "1",
      artistName: "Calvin Harris",
      eventName: "Electric Dreams Festival",
      stage: "Main Stage", 
      startTime: "10:00 PM",
      endTime: "11:30 PM",
      date: "Aug 15",
      hasClash: false,
    },
    {
      id: "2",
      artistName: "Disclosure", 
      eventName: "Electric Dreams Festival",
      stage: "Main Stage",
      startTime: "8:30 PM", 
      endTime: "10:00 PM",
      date: "Aug 15",
      hasClash: false,
    },
    {
      id: "3",
      artistName: "ODESZA",
      eventName: "Electric Dreams Festival", 
      stage: "Electronic Tent",
      startTime: "9:00 PM",
      endTime: "10:00 PM",
      date: "Aug 15",
      hasClash: true,
      clashWith: ["Disclosure"]
    },
    {
      id: "4",
      artistName: "Flume",
      eventName: "Sunset Grooves",
      stage: "Beach Stage",
      startTime: "5:30 PM",
      endTime: "6:30 PM", 
      date: "Aug 16",
      hasClash: false,
    },
    {
      id: "5",
      artistName: "Bonobo",
      eventName: "Sunset Grooves",
      stage: "Ambient Stage",
      startTime: "5:00 PM",
      endTime: "6:00 PM",
      date: "Aug 16", 
      hasClash: true,
      clashWith: ["Flume"]
    }
  ];

  return (
    <PersonalTimetable
      scheduleItems={mockScheduleItems}
      onRemoveItem={(id) => console.log('Remove item:', id)}
      onResolveClash={(id) => console.log('Resolve clash for:', id)}
    />
  );
}