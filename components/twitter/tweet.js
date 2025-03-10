import Image from "next/image";
import { memo } from "react";
import PropTypes from "prop-types";
import { useAppState } from "../../context/AppContext";
import PinActions from "./pin-actions";

function Tweet({
  text,
  id,
  author,
  media,
  created_at,
  public_metrics,
  referenced_tweets,
  pinned,
}) {
  const appState = useAppState();

  const authorUrl = `https://twitter.com/${author.username}`;
  const likeUrl = `https://twitter.com/intent/like?tweet_id=${id}`;
  const retweetUrl = `https://twitter.com/intent/retweet?tweet_id=${id}`;
  const replyUrl = `https://twitter.com/intent/tweet?in_reply_to=${id}`;
  const tweetUrl = `https://twitter.com/${author.username}/status/${id}`;
  const createdAt = new Date(created_at);

  const quoteTweet =
    referenced_tweets && referenced_tweets.find((t) => t.Type === "quoted");

  const retweetedTweet =
    referenced_tweets && referenced_tweets.find((t) => t.Type === "retweeted");

  return (
    <div className="py-5">
      <div className="flex justify-between">
        <div className="flex items-center">
          <a
            className="flex h-8 w-8"
            href={authorUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              alt={author.username}
              height={48}
              width={48}
              src={author.profile_image_url}
              className="rounded-full"
            />
          </a>
          <a
            href={authorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="author flex flex-col ml-4 no-underline"
          >
            <span
              className="flex items-center text-sm font-bold text-gray-900 dark:text-stone-200"
              title={author.name}
            >
              {author.name}
              {author.verified ? (
                <svg
                  aria-label="Verified Account"
                  className="ml-1 text-blue-500 dark:text-white inline h-4 w-4"
                  viewBox="0 0 24 24"
                >
                  <g fill="currentColor">
                    <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                  </g>
                </svg>
              ) : null}
            </span>
            <span
              className="text-gray-500 dark:text-stone-500 text-sm"
              title={`@${author.username}`}
            >
              @{author.username}
            </span>
          </a>
        </div>

        {appState.editMode && <PinActions pinned={pinned} tweetID={id} />}
      </div>
      <a href={tweetUrl} target="_blank" rel="noopener noreferrer">
        <div className="mt-1 whitespace-pre-wrap text-gray-600 dark:text-stone-300 text-sm font-medium">
          {!retweetedTweet && text}
        </div>
      </a>
      {media && media.length ? (
        <div
          className={
            media.length === 1
              ? "inline-grid grid-cols-1 gap-x-2 gap-y-2 my-2"
              : "inline-grid grid-cols-2 gap-x-2 gap-y-2 my-2"
          }
        >
          {media.map((m) => {
            // Sometimes the Twitter API return an empty string
            if (m.preview_image_url) {
              return (
                <Image
                  key={m.media_key}
                  alt={text}
                  height={m.height}
                  width={m.width}
                  src={m.preview_image_url}
                  className="rounded"
                />
              );
            }

            return null;
          })}
        </div>
      ) : null}
      {quoteTweet ? (
        <div className="pl-3 text-xs">
          <Tweet
            key={quoteTweet.id}
            text={quoteTweet.text}
            author={quoteTweet.Author}
            id={quoteTweet.id}
            media={quoteTweet.Media}
            created_at={quoteTweet.created_at}
            public_metrics={quoteTweet.public_metrics}
            referenced_tweets={quoteTweet.ReferencedTweets}
            pinned={quoteTweet.Pinned}
          />
        </div>
      ) : null}
      {retweetedTweet ? (
        <div className="pl-3 text-xs">
          <Tweet
            key={retweetedTweet.id}
            text={retweetedTweet.text}
            author={retweetedTweet.Author}
            id={retweetedTweet.id}
            media={retweetedTweet.Media}
            created_at={retweetedTweet.created_at}
            public_metrics={retweetedTweet.public_metrics}
            referenced_tweets={retweetedTweet.ReferencedTweets}
            pinned={retweetedTweet.Pinned}
          />
        </div>
      ) : null}
      <div className="flex text-gray-700 dark:text-stone-500 mt-4">
        <a
          className="flex items-center mr-4 text-gray-500 dark:text-stone-500 hover:text-blue-600 transition hover:underline"
          href={replyUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg className="mr-2" width="20" height="20" viewBox="0 0 24 24">
            <path
              className="fill-current"
              d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.045.286.12.403.143.225.385.347.633.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.368-3.43-7.788-7.8-7.79zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.334-.75-.75-.75h-.395c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"
            />
          </svg>
          <span>{Number(public_metrics.reply_count).toLocaleString()}</span>
        </a>
        <a
          className="flex items-center mr-4 text-gray-500 dark:text-stone-500 hover:text-green-600 transition hover:underline"
          href={retweetUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg className="mr-2" width="20" height="20" viewBox="0 0 24 24">
            <path
              className="fill-current"
              d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"
            />
          </svg>
          <span>{Number(public_metrics.retweet_count).toLocaleString()}</span>
        </a>
        <a
          className="flex items-center text-gray-500 dark:text-stone-500 hover:text-red-600 transition hover:underline"
          href={likeUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg className="mr-2" width="20" height="20" viewBox="0 0 24 24">
            <path
              className="fill-current"
              d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.813-1.148 2.353-2.73 4.644-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.375-7.454 13.11-10.037 13.156H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.035 11.596 8.55 11.658 1.52-.062 8.55-5.917 8.55-11.658 0-2.267-1.822-4.255-3.902-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.015-.03-1.426-2.965-3.955-2.965z"
            />
          </svg>
          <span>{Number(public_metrics.like_count).toLocaleString()}</span>
        </a>
      </div>
    </div>
  );
}

Tweet.propTypes = {
  text: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  author: PropTypes.object.isRequired,
  media: PropTypes.array,
  created_at: PropTypes.string.isRequired,
  public_metrics: PropTypes.object.isRequired,
  referenced_tweets: PropTypes.array,
  pinned: PropTypes.number,
};

export default memo(Tweet);
