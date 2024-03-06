import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  await prisma.widget.createMany({
    data: [
      {
        widgetName: 'Embed Widget',
        widgetDescription: `This is an Embed Widget

        To show a web page (news, forum posts, etc.), click on the "Settings" icon of this widget, enter the URL of the web page you want to embed.`
      },
      { widgetName: 'RSS News Reader' },
      { widgetName: 'Crypto StockChart' },
      { widgetName: 'Crypto Price Ticker' },
      { widgetName: 'Crypto Portfolio Tracker' },
    ]
  })

}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })