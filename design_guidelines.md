# Festival Planner Design Guidelines

## Design Approach
**Reference-Based Approach** - Drawing inspiration from **Spotify** and **Airbnb** for their exceptional event discovery and social features. The design will emphasize visual content, community engagement, and seamless mobile experience for festival-goers.

## Core Design Elements

### Color Palette
**Primary Colors:**
- Festival Purple: 280 65% 35% (dark mode primary)
- Electric Blue: 220 85% 55% (accent for interactive elements)
- Deep Night: 240 15% 8% (dark backgrounds)
- Warm White: 45 20% 96% (light mode backgrounds)

**Gradient Usage:**
- Hero sections: Purple to blue gradients (280 65% 35% to 220 85% 55%)
- Card overlays: Subtle dark gradients for text readability over images
- Button highlights: Gentle purple-to-pink gradients for CTAs

### Typography
- **Primary**: Inter (Google Fonts) - clean, modern readability
- **Accent**: Poppins (Google Fonts) - for headings and festival names
- **Scale**: Mobile-first with generous line heights for outdoor reading

### Layout System
**Tailwind Spacing Units: 2, 4, 6, 8, 12, 16**
- Consistent rhythm using these core units
- Mobile-optimized touch targets (minimum 44px)
- Generous whitespace for festival content breathing room

## Component Library

### Navigation
- Bottom tab bar for mobile (primary navigation)
- Floating action button for quick "Add to Schedule" 
- Sticky search/filter bar on discovery pages

### Event Cards
- Large festival imagery with gradient text overlays
- Artist lineup previews with thumbnail grids
- Date/location badges with purple accents
- Social attendance indicators (friend avatars)

### Personal Timetable
- Timeline view with color-coded stages
- Clash detection alerts (red warning badges)
- Drag-to-reorder functionality
- Quick artist info popover on tap

### Social Features
- Friend attendance lists with profile photos
- "Going" toggle buttons with haptic feedback
- Activity feed for friend updates

## Visual Treatment

### Hero Sections
- Full-viewport festival hero images with gradient overlays
- Floating outline buttons with blurred backgrounds
- No hover states on hero buttons (native interactions only)

### Content Hierarchy
- Festival names: Large, bold Poppins headings
- Artist details: Clean Inter body text with purple accents
- Dates/times: Prominent, easy-to-scan formatting
- Social proof: Subtle but visible friend indicators

### Interactive Elements
- Purple-to-pink gradient buttons for primary actions
- Soft shadows and subtle animations
- Card-based layouts with rounded corners (8px radius)
- High contrast for outdoor visibility

## Images
**Large hero images** featured prominently on:
- Event detail pages (festival main image)
- Artist profile sections
- Stage/venue showcases

**Thumbnail grids** for:
- Artist lineups on event cards
- Friend attendance lists
- Festival photo galleries

**Background treatments:**
- Subtle venue photography with dark overlays
- Stage lighting effects for atmospheric backgrounds
- Clean geometric patterns for admin sections

## Accessibility
- High contrast ratios for outdoor mobile use
- Large touch targets (minimum 44px)
- Clear visual hierarchy with consistent color coding
- Readable fonts at small mobile sizes

This design creates an engaging, social festival experience optimized for mobile users while maintaining the excitement and energy of live music events.