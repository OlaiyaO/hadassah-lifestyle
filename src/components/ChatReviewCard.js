import { CheckCheck, MessageCircle } from 'lucide-react';

export function ChatReviewCard({ review }) {
  return (
    <article className="chat-review" aria-label={`Review from ${review.name}`}>
      <header className="chat-review__header">
        <span className="chat-review__avatar" aria-hidden="true">
          {review.initial}
        </span>
        <div>
          <strong>{review.name}</strong>
          <span>customer</span>
        </div>
        <MessageCircle aria-hidden="true" />
      </header>

      <div className="chat-review__conversation">
        <span className="chat-review__date">Today</span>
        <div className="chat-review__bubble chat-review__bubble--sent">
          <p>{review.prompt}</p>
          <small>
            {review.promptTime} <CheckCheck aria-hidden="true" />
          </small>
        </div>
        <blockquote className="chat-review__bubble chat-review__bubble--received">
          <p>{review.message}</p>
          <small>{review.time}</small>
        </blockquote>
      </div>
    </article>
  );
}
