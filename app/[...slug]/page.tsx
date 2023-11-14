interface SlugPageProps {
  params: {
    slug: string[]
  }
}

export default function SlugPage({ params: { slug } }: SlugPageProps) {
  const shortLink = slug[0]
  console.log(shortLink)

  return <div>Link: {shortLink}</div>
}
