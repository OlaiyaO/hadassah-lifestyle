import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

import { editorialConcepts } from '@/data/editorialConcepts';

export function EditorialConcepts() {
  return (
    <section className="editorial-concepts section" id="editorial-concepts">
      <div className="editorial-concepts__heading">
        <div>
          <p className="eyebrow eyebrow--dark">Editorial concepts</p>
          <h2>
            A little inspiration, <em>beautifully considered.</em>
          </h2>
        </div>
        <p>
          Replaceable presentation templates showing how Hadassah can curate fashion, gifts and the
          home. Illustrative imagery and direction only.
        </p>
      </div>
      <div className="editorial-concepts__grid">
        {editorialConcepts.map((concept) => (
          <article
            className={`editorial-concept editorial-concept--${concept.layout}`}
            key={concept.id}
          >
            <div className="editorial-concept__media">
              <Image
                src={concept.image}
                alt={concept.imageAlt}
                fill
                sizes="(min-width: 900px) 40vw, 82vw"
              />
              <div className="editorial-concept__veil" />
              <span className="editorial-concept__label">
                Concept {concept.number} · {concept.category}
              </span>
            </div>
            <div className="editorial-concept__copy">
              <h3>{concept.title}</h3>
              <p>{concept.description}</p>
              <a href={concept.href}>
                {concept.action} <ArrowUpRight />
              </a>
              <small>Editorial template · replace with an approved Hadassah story</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
