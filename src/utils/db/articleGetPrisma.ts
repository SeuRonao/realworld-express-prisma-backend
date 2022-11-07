import prisma from "./prisma";

export default async function articleGetPrisma(slug: string) {
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      author: true,
      tagList: true,
    },
  });
  return article;
}