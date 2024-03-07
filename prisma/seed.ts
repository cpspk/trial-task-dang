import { PrismaClient, WidgetName } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  await prisma.widget.createMany({
    data: [
      {
        widgetName: WidgetName.EmbedWidget,
        widgetDescription: "This is an Embed Widget. To show a web page (news, forum posts, etc.), click on the \"Settings\" icon of this widget, enter the URL of the web page you want to embed."
      },
      {
        widgetName: WidgetName.RssNewsReader,
        widgetDescription: "Fetch news from specified RSS source  "
      },
      {
        widgetName: WidgetName.StockChart,
        widgetDescription: "Displays cryptocurrency price charts"
      },
      {
        widgetName: WidgetName.PriceTicker,
        widgetDescription: "Display real-time prices of major cryptocurrencies"
      },
      {
        widgetName: WidgetName.PortfolioTracker,
        widgetDescription: "Fetch real-time prices and calculate portfolio value for the connected wallet of the user."
      },
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