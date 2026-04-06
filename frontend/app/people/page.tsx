import { getPeople } from "../../lib/api";

export default async function PeoplePage() {
  const { people } = await getPeople();
  return (
    <section>
      <h2>People</h2>
      <div className="chips">
        {people.map((person: any) => (
          <div key={person.id} className="chip">
            <span>{person.displayName ?? "Unnamed Person"}</span>
            <small>{person.faceIds.length} faces</small>
          </div>
        ))}
      </div>
    </section>
  );
}
