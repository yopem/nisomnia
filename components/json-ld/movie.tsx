import type {
  AggregateRating,
  ArticleAuthor,
  BroadcastEvent,
  Clip,
  Offers,
  Video,
} from "next-seo/lib/types"

import { JsonLd, type JsonLdProps } from "@/components/json-ld/json-ld"

function generateAuthorInfo(author: string | ArticleAuthor) {
  if (typeof author === "string") {
    return {
      "@type": "Person",
      name: author,
    }
  } else if (author.name) {
    return {
      "@type": author?.type ?? "Person",
      name: author.name,
      url: author?.url,
    }
  }

  return
}

function setAuthor(
  author?: string | string[] | ArticleAuthor | ArticleAuthor[],
) {
  if (Array.isArray(author)) {
    return author
      .map((item) => generateAuthorInfo(item))
      .filter((item) => !!item)
  } else if (author) {
    return generateAuthorInfo(author)
  }

  return
}

interface MovieActor {
  actor: string
  characterName?: string
}

function setActor(actors?: MovieActor | MovieActor[]) {
  function mapOffer({ actor, characterName }: MovieActor) {
    return {
      "@type": "PerformanceRole",
      ...(actors && {
        actor: {
          "@type": "Person",
          name: actor,
        },
        ...(characterName && { characterName: characterName }),
      }),
    }
  }

  if (Array.isArray(actors)) {
    return actors.map(mapOffer)
  } else if (actors) {
    return mapOffer(actors)
  }

  return undefined
}

function setDirector(director?: string) {
  if (director) {
    return {
      "@type": "Person",
      name: director,
    }
  }
  return undefined
}

function setClip(clips?: Clip | Clip[]) {
  function mapClip(clip: Clip) {
    return {
      ...clip,
      "@type": "Clip",
    }
  }

  if (Array.isArray(clips)) {
    return clips.map(mapClip)
  } else if (clips) {
    return mapClip(clips)
  }

  return undefined
}

function setInteractionStatistic(watchCount?: number) {
  if (watchCount) {
    return {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/WatchAction",
      userInteractionCount: watchCount,
    }
  }
  return undefined
}

function setBroadcastEvent(publication?: BroadcastEvent | BroadcastEvent[]) {
  function mapBroadcastEvent(publication?: BroadcastEvent) {
    return {
      ...publication,
      "@type": "BroadcastEvent",
    }
  }

  if (publication) {
    if (Array.isArray(publication)) {
      return publication.map(mapBroadcastEvent)
    }
    return mapBroadcastEvent(publication)
  }

  return undefined
}

function setVideo(video?: Video, setContext = false) {
  function mapVideo(
    { thumbnailUrls, hasPart, watchCount, publication, ...rest }: Video,
    context: boolean,
  ) {
    return {
      ...rest,
      "@type": "VideoObject",
      ...(context && { "@context": "https://schema.org" }),
      thumbnailUrl: thumbnailUrls,
      hasPart: setClip(hasPart),
      interactionStatistic: setInteractionStatistic(watchCount),
      publication: setBroadcastEvent(publication),
    }
  }
  if (video) {
    return mapVideo(video, setContext)
  }
  return undefined
}

function setOffers(offers?: Offers | Offers[]) {
  function mapOffer({ seller, ...rest }: Offers) {
    return {
      ...rest,
      "@type": "Offer",
      ...(seller && {
        seller: {
          "@type": "Organization",
          name: seller.name,
        },
      }),
    }
  }

  if (Array.isArray(offers)) {
    return offers.map(mapOffer)
  } else if (offers) {
    return mapOffer(offers)
  }

  return undefined
}

function setAggregateRating(aggregateRating?: AggregateRating) {
  if (aggregateRating) {
    return {
      "@type": "AggregateRating",
      ratingCount: aggregateRating.ratingCount,
      reviewCount: aggregateRating.reviewCount,
      bestRating: aggregateRating.bestRating,
      ratingValue: aggregateRating.ratingValue,
      worstRating: aggregateRating.worstRating,
    }
  }
  return undefined
}

export interface MovieJsonLdProps extends JsonLdProps {
  keyOverride?: string
  name: string
  contentRating: number
  duration: string
  dateCreated: string
  description: string
  image: string
  authorName?: string
  directorName?: string
  actors?: MovieActor | MovieActor[]
  genreName?: string | string[]
  trailer?: Video
  offers?: Offers | Offers[]
  countryOfOrigin?: string
  aggregateRating?: AggregateRating
}

const MovieJsonLd: React.FC<MovieJsonLdProps> = (props) => {
  const {
    type = "Movie",
    keyOverride,
    authorName,
    directorName,
    actors,
    genreName,
    trailer,
    offers,
    countryOfOrigin,
    aggregateRating,
    ...rest
  } = props

  const data = {
    ...rest,
    author: setAuthor(authorName),
    director: setDirector(directorName),
    actors: setActor(actors),
    genre: genreName,
    trailer: setVideo(trailer),
    offers: setOffers(offers),
    countryOfOrigin: countryOfOrigin,
    aggregateRating: setAggregateRating(aggregateRating),
  }

  return (
    <JsonLd type={type} keyOverride={keyOverride} {...data} scriptKey="Movie" />
  )
}

export default MovieJsonLd
