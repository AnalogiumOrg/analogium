import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface StaffMember {
	slug: string;
	title: string;
	heroImage: string; // e.g. "FF", "MA", "AV", "AR", "CA", "NO", "VO"
	author: string;
	description: string;
	contentHtml?: string;
}

export const useStaffStore = defineStore('staff', () => {
	const members = ref<StaffMember[]>([
		{
			slug: 'founding-father',
			title: 'THE FOUNDING FATHER',
			heroImage: 'FF',
			author: 'F.F.',
			description: 'Founder & Visionary of ANALOGIUM.',
			contentHtml: `
				<p>I can describe myself as a visionary, a man in eternal slumber, trapped on a lucid fever dream. When I created ANALOGIUM, I was at first alone, stranded on an island and forced to find a way forward, trying to keep everything in place with only my hands, sometimes succeeding, and other times... well you can figure that one out. Every time I went back to my office, thinking on more and more ideas, more stories I could fit in, and how could I expand the team since these cold walls were acting more like a private asylum. Then it clicked, who was I before chaining my soul to this new mantra? A nobody. A troubled child surrounded by cutthroats. A plague. Could it be there another instance of my own phenomenon?</p>
				<p>I settled on the task of giving those rejects the helping hand they needed, the same hand I crafted for myself so long ago... oh Lord how disappointed I am at you, I expected a harder challenge. My team was lost, scared, vulnerable, "foolish" if one of you normal-craniums want to put it like that. It took a little bit of time to get the used to this cold complex, but it was all worth it. The first one I could get inside the team was my dearest and closest friend: THE MACHINERY. If I ever get another idea, he is always there to help me make it a reality. I can't deny that there were some old members, they left for reasons beyond my control, some ment a big loose to our team, a whole hard to fill, and some others... <i>are better gone</i>.</p>
				<p>This place, this society I managed to craft, the same minded fellas I got the chance of discovering (for the better or for the worse), is the biggest project I had. Me and my team will continue to archive all these amazing stories, even if the media dies tomorrow, or the normal-craniums find something new to be scared of. <b>Fear is forever.</b></p>
			`
		},
		{
			slug: 'machinery',
			title: 'THE MACHINERY',
			heroImage: 'MA',
			author: 'F.F.',
			description: 'Master of Cogs, Systems & Mechanics.',
			contentHtml: `
				<p>My dearest friend, always surrounded by cogs and wires. Everytime I get a new idea, an idea that has to do with mechanical tools or specific algorithms, he finds a way to make it work.</p>
				<p>MACHINERY was the first member of the complex, responsable of the better and more beautiful craft I could've ever do by myself. I admit, I am capable of working with these systems, in fact I put my hands on them now and then, but never, in a million of eons, could do the complex and confusing stuff HE can do.</p>
				<p>Probably the most isolated member; rarely do I see him out his workshop, let alone with somebody else. I respect his hermit behaviour. <i>The AUTOMATON ain't building itself, y'know?</i></p>
			`
		},
		{
			slug: 'archivist',
			title: 'THE ARCHIVIST',
			heroImage: 'AV',
			author: 'F.F.',
			description: 'Keeper of Records & Documents.',
			contentHtml: `<p>Keeper of historical records, media documentation, and data archives across ANALOGIUM.</p>`
		},
		{
			slug: 'artist',
			title: 'THE ARTIST',
			heroImage: 'AR',
			author: 'F.F.',
			description: 'Visual Concepts & Imagery Production.',
			contentHtml: `<p>Crafting visual artwork, illustrations, and stylistic assets for the ANALOGIUM ecosystem.</p>`
		},
		{
			slug: 'corner-angel',
			title: 'THE CORNER ANGEL',
			heroImage: 'CA',
			author: 'F.F.',
			description: 'Watcher & Guardian of the Complex.',
			contentHtml: `<p>Observing from the shadows, ensuring order within the domain.</p>`
		},
		{
			slug: 'novelist',
			title: 'THE NOVELIST',
			heroImage: 'NO',
			author: 'F.F.',
			description: 'Narrative Architect & Storyteller.',
			contentHtml: `<p>Weaving intricate narratives and lore into documented cases.</p>`
		},
		{
			slug: 'vocalist',
			title: 'THE VOCALIST',
			heroImage: 'VO',
			author: 'F.F.',
			description: 'Audio Transmissions & Sound Design.',
			contentHtml: `<p>Voice transmissions, audio frequency analysis, and soundscape architecture.</p>`
		}
	]);

	const getMemberBySlug = (slug: string) => {
		return members.value.find(m => m.slug === slug);
	};

	return {
		members,
		getMemberBySlug
	};
});
